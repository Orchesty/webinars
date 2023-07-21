import ASqlBatchConnector from '@orchesty/nodejs-connectors/dist/lib/Sql/Common/ASqlBatchConnector';
import BatchProcessDto from '@orchesty/nodejs-sdk/dist/lib/Utils/BatchProcessDto';
import { IInput } from './ListAllCategories';

export const NAME = 'list-all-stocks';

export default class ListAllStocks extends ASqlBatchConnector {

    protected name = NAME;

    public getName(): string {
        return this.name;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected getQuery(processDto: BatchProcessDto): Promise<string> | string {
        return String('SELECT i.PROD_ID as `productId`, i.QUAN_IN_STOCK as `stockQuantity`, i.SALES as `sales`'
            + ', p.COMMON_PROD_ID as `sku` FROM `inventory` i LEFT JOIN `products` p ON i.PROD_ID = p.PROD_ID');
    }

    protected processResult(res: IInput, dto: BatchProcessDto): BatchProcessDto {
        dto.setItemList(res.rows);

        return dto;
    }

}

export interface IOutput {
    productId: number;
    stockQuantity: number;
    sales: number;
    sku: number;
}
