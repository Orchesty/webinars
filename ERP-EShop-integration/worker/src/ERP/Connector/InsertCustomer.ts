import ASqlConnector from '@orchesty/nodejs-connectors/dist/lib/Sql/Common/ASqlConnector';
import ProcessDto from '@orchesty/nodejs-sdk/dist/lib/Utils/ProcessDto';
import { IOutput as IInput } from '../CustomNode/WooCommerceToERPOrderMapper';

export const NAME = 'insert-customer';

export default class InsertCustomer extends ASqlConnector {

    protected name = NAME;

    public getName(): string {
        return this.name;
    }

    protected getQuery(processDto: ProcessDto<IInput>): Promise<string> | string {
        const { customer } = processDto.getJsonData();

        return String('INSERT INTO `customers` ('
            + '`FIRSTNAME`, '
            + '`LASTNAME`, '
            + '`ADDRESS1`, '
            + '`ADDRESS2`, '
            + '`CITY`, '
            + '`STATE`, '
            + '`ZIP`, '
            + '`COUNTRY`, '
            + '`REGION`, '
            + '`EMAIL`, '
            + '`PHONE`, '
            + '`CREDITCARDTYPE`, '
            + '`CREDITCARD`, '
            + '`CREDITCARDEXPIRATION`, '
            + '`USERNAME`, '
            + '`PASSWORD`, '
            + '`AGE`, '
            + '`INCOME`, '
            + '`GENDER`) VALUES ('
            + `'${customer.firstName ?? ''}',`
            + `'${customer.lastName ?? ''}',`
            + `'${customer.address1 ?? ''}',`
            + `'${customer.address2 ?? ''}',`
            + `'${customer.city ?? ''}',`
            + `'${customer.state ?? ''}',`
            + `${customer.zip ?? null},`
            + `'${customer.country ?? ''}',`
            + `${customer.region ?? null},`
            + `'${customer.email ?? ''}',`
            + `'${customer.phone ?? ''}',`
            + `${customer.creditCardType ?? null},`
            + `'${customer.creditCard ?? ''}',`
            + `'${customer.creditCardExpiration ?? ''}',`
            + `'${customer.username ?? ''}',`
            + `'${customer.password ?? ''}',`
            + `${customer.age ?? null},`
            + `${customer.income ?? null},`
            + `'${customer.gender ?? ''}')`);
    }

    protected processResult(res: { rows: number }, dto: ProcessDto<IInput>): ProcessDto<IOutput> {
        const { order, orderLines } = dto.getJsonData();

        order.customerId = res.rows;

        dto.setNewJsonData({
            order,
            orderLines,
        });

        return dto;
    }

}

export interface IOutput {
    order: IInput['order'];
    orderLines: IInput['orderLines'];
}
