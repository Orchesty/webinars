import ASqlConnector from '@orchesty/nodejs-connectors/dist/lib/Sql/Common/ASqlConnector';
import ProcessDto from '@orchesty/nodejs-sdk/dist/lib/Utils/ProcessDto';
import { IOutput as IInput } from './InsertCustomer';

export const NAME = 'insert-order';

export default class InsertOrder extends ASqlConnector {

    protected name = NAME;

    public getName(): string {
        return this.name;
    }

    protected getQuery(processDto: ProcessDto<IInput>): Promise<string> | string {
        const { order } = processDto.getJsonData();

        return String('INSERT INTO `orders` ('
            + '`ORDERDATE`, '
            + '`CUSTOMERID`, '
            + '`NETAMOUNT`, '
            + '`TAX`, '
            + '`TOTALAMOUNT`) VALUES ('
            + `STR_TO_DATE('${order.orderDate ?? null}', '%Y-%m-%d'),`
            + `${order.customerId ?? null},`
            + `${order.netAmount ?? null},`
            + `${order.tax ?? null},`
            + `${order.totalAmount ?? null})`);
    }

    protected processResult(res: { rows: number }, dto: ProcessDto<IInput>): ProcessDto<IOutput> {
        const { orderLines } = dto.getJsonData();

        dto.setNewJsonData<IOutput>({
            orderLines: orderLines.map((orderLine) => {
                // eslint-disable-next-line no-param-reassign
                orderLine.orderId = res.rows;

                return orderLine;
            }),
        });

        return dto;
    }

}

export interface IOutput {
    orderLines: IInput['orderLines'];
}
