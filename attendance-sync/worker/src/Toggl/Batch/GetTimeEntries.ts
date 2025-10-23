import ABatchNode from '@orchesty/nodejs-sdk/dist/lib/Batch/ABatchNode';
import { HttpMethods } from '@orchesty/nodejs-sdk/dist/lib/Transport/HttpMethods';
import BatchProcessDto from '@orchesty/nodejs-sdk/dist/lib/Utils/BatchProcessDto';

export const NAME = 'get-time-entries';

export class GetTimeEntries extends ABatchNode {

    public getName(): string {
        return NAME;
    }

    public async processAction(dto: BatchProcessDto<IInput>): Promise<BatchProcessDto> {
        const { from, to } = dto.getJsonData();

        if (!from || !to) {
            throw new Error('Missing from or to date');
        }

        const req = await this.getApplication().getRequestDto(
            dto,
            await this.getApplicationInstallFromProcess(dto),
            HttpMethods.GET,
            `me/time_entries?start_date=${from}&end_date=${to}`,
        );
        const resp = await this.getSender().send<IOutput[]>(req, [200]);

        return dto.setItemList(resp.getJsonBody());
    }

}

export interface IInput {
    from: string;
    to: string;
}

export interface IOutput {
    description: string | null;
    duration: number;
    start: string;
    id: number;
    project_id: number;
}
