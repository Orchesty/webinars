import ASqlConnector from '@orchesty/nodejs-connectors/dist/lib/Sql/Common/ASqlConnector';
import ProcessDto from '@orchesty/nodejs-sdk/dist/lib/Utils/ProcessDto';
import { IOutput as IInput } from '../CustomNode/WooCommerceToERPOrderMapper';
import { NAME as InsertCustomer } from './InsertCustomer';
import { NAME as OrderExists } from './OrderExists';

export const NAME = 'customer-exists';

export default class CustomerExists extends ASqlConnector {

    protected name = NAME;

    public getName(): string {
        return this.name;
    }

    protected getQuery(processDto: ProcessDto<IInput>): Promise<string> | string {
        const { customer } = processDto.getJsonData();

        return String(`SELECT COUNT(*) AS count FROM \`customers\` WHERE EMAIL = '${customer.email}'`);
    }

    protected processResult(res: { rows: { count: number }[] }, dto: ProcessDto<IInput>): ProcessDto {
        if (res.rows[0].count) {
            const { order, orderLines } = dto.getJsonData();

            dto.setNewJsonData({ order, orderLines });
            dto.setForceFollowers(OrderExists);

            return dto;
        }

        dto.setForceFollowers(InsertCustomer);
        return dto;
    }

}
