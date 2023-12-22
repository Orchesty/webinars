import { NAME as WOOCOMMERCE_CREATE_PRODUCT } from '@orchesty/nodejs-connectors/dist/lib/WooCommerce/Connector/WooCommerceCreateProduct';
import { NAME as WOOCOMMERCE_UPDATE_PRODUCT } from '@orchesty/nodejs-connectors/dist/lib/WooCommerce/Connector/WooCommerceUpdateProduct';
import ProcessDto from '@orchesty/nodejs-sdk/dist/lib/Utils/ProcessDto';
import { IInput } from '../CustomNode/ERPToWooCommerceProductMapper';
import AFindProductBySkuCache from './AFindProductBySkuCache';

export const NAME = 'find-product-by-sku-cache-sync-products';

export default class FindProductBySkuCacheSyncProducts extends AFindProductBySkuCache {

    public getName(): string {
        return NAME;
    }

    protected processFoundId(foundId: string, dto: ProcessDto<IInput>): void {
        const { name, regular_price, date_created, sku, categoryId } = dto.getJsonData();

        /* eslint-disable @typescript-eslint/naming-convention */
        dto.setNewJsonData<unknown>({
            name,
            regular_price,
            date_created,
            sku,
            categories: [
                {
                    id: categoryId,
                },
            ],
            id: Number(foundId),
        });
        /* eslint-enable @typescript-eslint/naming-convention */

        if (!foundId) {
            dto.setForceFollowers(WOOCOMMERCE_CREATE_PRODUCT);
        } else {
            dto.setForceFollowers(WOOCOMMERCE_UPDATE_PRODUCT);
        }
    }

}
