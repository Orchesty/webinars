import ASqlConnector from '@orchesty/nodejs-connectors/dist/lib/Sql/Common/ASqlConnector';
import ProcessDto from '@orchesty/nodejs-sdk/dist/lib/Utils/ProcessDto';
import ResultCode from '@orchesty/nodejs-sdk/dist/lib/Utils/ResultCode';
import { IOutput as IInput } from './InsertCustomer';

export const NAME = 'order-exists';

export default class OrderExists extends ASqlConnector {

    protected name = NAME;

    public getName(): string {
        return this.name;
    }

    protected getQuery(processDto: ProcessDto<IInput>): Promise<string> | string {
        const { order } = processDto.getJsonData();

        return String(`SELECT COUNT(*) AS count FROM \`orders\` WHERE ORDERID = '${order.orderNumber}'`);
    }

    protected processResult(res: { rows: { count: number }[] }, dto: ProcessDto<IInput>): ProcessDto {
        if (res.rows[0].count) {
            const { order } = dto.getJsonData();

            dto.setStopProcess(ResultCode.DO_NOT_CONTINUE, `Order with number=${order.orderNumber} already exists!`);
        }

        return dto;
    }

}
