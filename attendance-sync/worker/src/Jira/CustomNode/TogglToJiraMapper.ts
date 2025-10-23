import ACommonNode from '@orchesty/nodejs-sdk/dist/lib/Commons/ACommonNode';
import ProcessDto from '@orchesty/nodejs-sdk/dist/lib/Utils/ProcessDto';
import { IOutput as IInput } from '../../Toggl/Batch/GetTimeEntries';
import { IInput as IOutput } from '../Connector/CreateWorklog';

export const NAME = 'toggl-to-jira-mapper';

export class TogglToJiraMapper extends ACommonNode {

    public getName(): string {
        return NAME;
    }

    public processAction(dto: ProcessDto<IInput>): ProcessDto<IOutput> {
        const data = dto.getJsonData();

        const [id, description] = data.description?.split(' -- ', 2) ?? [];
        if (!id) {
            throw new Error('Missing id');
        }

        if (!description) {
            throw new Error('Missing description');
        }

        const started = new Date(data.start).toISOString().replace('Z', '+0000');

        return dto.setNewJsonData({
            id,
            timeSpentSeconds: data.duration,
            started,
            comment: {
                version: 1,
                type: 'doc',
                content: [
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: description,
                            },
                        ],
                    },
                ],
            },
        });
    }

}
