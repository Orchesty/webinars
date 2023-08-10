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

        return String(`SELECT CUSTOMERID AS customerId FROM \`customers\` WHERE EMAIL = '${customer.email}'`);
    }

    protected processResult(
        res: { rows: { customerId: number }[] },
        dto: ProcessDto<IInput>,
    ): ProcessDto {
        const customerId = res.rows.length > 0 ? res.rows[0].customerId : undefined;
        if (customerId !== undefined && customerId !== null) {
            const { order, orderLines } = dto.getJsonData();
            order.customerId = customerId;

            dto.setNewJsonData({ order, orderLines });
            dto.setForceFollowers(OrderExists);

            return dto;
        }

        dto.setForceFollowers(InsertCustomer);
        return dto;
    }

}
