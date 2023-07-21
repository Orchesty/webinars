import ASqlConnector from '@orchesty/nodejs-connectors/dist/lib/Sql/Common/ASqlConnector';
import ProcessDto from '@orchesty/nodejs-sdk/dist/lib/Utils/ProcessDto';
import { IOutput as IInput } from './InsertOrder';

export const NAME = 'insert-order-line';

export default class InsertOrderLine extends ASqlConnector {

    protected name = NAME;

    public getName(): string {
        return this.name;
    }

    protected getQuery(processDto: ProcessDto<IInput>): Promise<string> | string {
        const { orderLines } = processDto.getJsonData();
        const values = orderLines.map((line, index) => String('('
                + `${index + 1},`
                + `${line.orderId ?? null},`
                + `${line.prodId ?? null},`
                + `${line.quantity ?? null},`
                + `STR_TO_DATE('${line.orderDate ?? null}', '%Y-%m-%d'))`));

        return String('INSERT INTO `orderlines` ('
            + '`ORDERLINEID`, '
            + '`ORDERID`, '
            + '`PROD_ID`, '
            + '`QUANTITY`, '
            + '`ORDERDATE`) VALUES ') + values.join(', ');
    }

    protected processResult(res: { rows: number }, dto: ProcessDto<IInput>): ProcessDto<IInput> {
        return dto;
    }

}
