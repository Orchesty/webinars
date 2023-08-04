import ASqlBatchConnector from '@orchesty/nodejs-connectors/dist/lib/Sql/Common/ASqlBatchConnector';
import BatchProcessDto from '@orchesty/nodejs-sdk/dist/lib/Utils/BatchProcessDto';
import { IOutput as IRunTopologyInput } from '../../Common/RunProductsTopology';

export const NAME = 'list-all-categories';
export const MYSQL_NAME = 'mysql';

export default class ListAllCategories extends ASqlBatchConnector {

    protected name = NAME;

    public getName(): string {
        return this.name;
    }

    protected getQuery(processDto: BatchProcessDto<IRunTopologyInput>): Promise<string> | string {
        const { ids } = processDto.getJsonData();
        let baseQuery = 'SELECT CATEGORY as `category`, CATEGORYNAME as `categoryName` FROM `categories`';

        if (ids) {
            baseQuery += ` WHERE \`CATEGORY\` IN (${ids})`;
        }

        return baseQuery;
    }

    protected processResult(res: IInput, dto: BatchProcessDto): BatchProcessDto {
        dto.setItemList(res.rows);

        return dto;
    }

}

export interface IInput {
    rows: IOutput[];
}

export interface IOutput {
    category: number;
    categoryName: string;
}
