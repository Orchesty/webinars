import { IOutput } from '@orchesty/nodejs-connectors/dist/lib/WooCommerce/Batch/WooCommerceGetProducts';
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
        const { name, price, date_created, sku } = dto.getJsonData();

        dto.setNewJsonData<IOutput>({
            name,
            price,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            date_created,
            sku,
            id: Number(foundId),
        });
        if (!foundId) {
            dto.setForceFollowers(WOOCOMMERCE_CREATE_PRODUCT);
        } else {
            dto.setForceFollowers(WOOCOMMERCE_UPDATE_PRODUCT);
        }
    }

}
