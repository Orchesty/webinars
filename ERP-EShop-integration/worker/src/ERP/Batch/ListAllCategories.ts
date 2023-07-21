import ASqlBatchConnector from '@orchesty/nodejs-connectors/dist/lib/Sql/Common/ASqlBatchConnector';
import BatchProcessDto from '@orchesty/nodejs-sdk/dist/lib/Utils/BatchProcessDto';

export const NAME = 'list-all-categories';
export const MYSQL_NAME = 'mysql';

export default class ListAllCategories extends ASqlBatchConnector {

    protected name = NAME;

    public getName(): string {
        return this.name;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected getQuery(processDto: BatchProcessDto): Promise<string> | string {
        return 'SELECT CATEGORY as `category`, CATEGORYNAME as `categoryName` FROM `categories`';
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
