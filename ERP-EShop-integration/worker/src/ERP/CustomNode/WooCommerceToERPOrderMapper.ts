import { IResponseJson as IInput } from '@orchesty/nodejs-connectors/dist/lib/WooCommerce/Batch/WooCommerceGetOrders';
import ACommonNode from '@orchesty/nodejs-sdk/dist/lib/Commons/ACommonNode';
import ProcessDto from '@orchesty/nodejs-sdk/dist/lib/Utils/ProcessDto';

export const NAME = 'woo-commerce-to-erp-order-mapper';

export default class WooCommerceToERPOrderMapper extends ACommonNode {

    public getName(): string {
        return NAME;
    }

    public processAction(dto: ProcessDto<IInput>): ProcessDto<IOutput> {
        const { billing, line_items, date_created, total_tax, total, number } = dto.getJsonData();
        const dateCreated = date_created.slice(0, 10);

        return dto.setNewJsonData({
            customer: {
                firstName: billing.first_name,
                lastName: billing.last_name,
                address1: billing.address_1,
                address2: billing.address_2,
                city: billing.city,
                state: billing.state,
                zip: Number(billing.postcode),
                country: billing.country,
                email: billing.email,
                phone: billing.phone,
            },
            order: {
                orderNumber: Number(number),
                orderDate: dateCreated,
                tax: Number(total_tax),
                totalAmount: Number(total),
            },
            orderLines: line_items.map((item) => ({
                prodId: item.product_id,
                quantity: item.quantity,
                orderDate: dateCreated,
            })),
        });
    }

}

export interface IOutput {
    customer: {
        firstName: string;
        lastName: string;
        address1: string;
        address2: string;
        city: string;
        state: string;
        zip: number;
        country: string;
        email: string;
        phone: string;
        customerId?: number;
        region?: number;
        creditCardType?: number;
        creditCard?: string;
        creditCardExpiration?: string;
        username?: string;
        password?: string;
        age?: number;
        income?: number;
        gender?: string;
    };
    order: {
        orderNumber: number;
        orderDate: string;
        tax: number;
        totalAmount: number;
        customerId?: number;
        netAmount?: number;
    };
    orderLines: IOrderLine[];
}

export interface IOrderLine {
    prodId: number;
    quantity: number;
    orderDate: string;
    orderLineId?: number;
    orderId?: number;
}
