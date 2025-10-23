import AConnector from '@orchesty/nodejs-sdk/dist/lib/Connector/AConnector';
import { HttpMethods } from '@orchesty/nodejs-sdk/dist/lib/Transport/HttpMethods';
import ProcessDto from '@orchesty/nodejs-sdk/dist/lib/Utils/ProcessDto';

export const NAME = 'create-worklog';

export class CreateWorklog extends AConnector {

    public getName(): string {
        return NAME;
    }

    public async processAction(dto: ProcessDto<IInput>): Promise<ProcessDto> {
        const { id, ...rest } = dto.getJsonData();

        const req = await this.getApplication().getRequestDto(
            dto,
            await this.getApplicationInstallFromProcess(dto),
            HttpMethods.POST,
            `rest/api/3/issue/${id}/worklog`,
            rest,
        );
        const resp = await this.getSender().send(req, [200]);

        return dto.setNewJsonData(resp.getJsonBody());
    }

}

export interface IInput {
    id: string;
    timeSpentSeconds: number;
    started: string;
    comment: {
        version: number;
        type: 'doc';
        content: {
            content: {
                text: string;
                type: 'text';
            }[],
            type: 'paragraph';
        }[],
    },
}
