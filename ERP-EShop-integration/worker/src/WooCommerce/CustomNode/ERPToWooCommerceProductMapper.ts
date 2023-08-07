import { IOutput } from '@orchesty/nodejs-connectors/dist/lib/WooCommerce/Batch/WooCommerceGetProducts';
import ACommonNode from '@orchesty/nodejs-sdk/dist/lib/Commons/ACommonNode';
import ProcessDto from '@orchesty/nodejs-sdk/dist/lib/Utils/ProcessDto';
import slugify from 'slugify';

export const NAME = 'erp-to-woo-commerce-product-mapper';

export default class ERPToWooCommerceProductMapper extends ACommonNode {

    public getName(): string {
        return NAME;
    }

    public processAction(dto: ProcessDto<IInput>): ProcessDto<IInput> {
        const { id, name, price, date_created, sku, slug, categoryId } = dto.getJsonData();

        /* eslint-disable @typescript-eslint/naming-convention */
        return dto.setNewJsonData({
            id,
            name,
            price,
            date_created,
            slug: slugify(slug).toLowerCase(),
            categoryId,
            sku: String(sku),
        });
        /* eslint-enable @typescript-eslint/naming-convention */
    }

}

export interface IInput extends IOutput {
    slug: string;
    categoryId: number;
}
