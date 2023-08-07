import ProcessDto from '@orchesty/nodejs-sdk/dist/lib/Utils/ProcessDto';
import { NAME as STORE_RELATION } from '../../ERP/CustomNode/StoreRelation';
import AFindProductCategoryCache from './AFindProductCategoryCache';
import { NAME as FIND_PRODUCT_BY_SKU_CACHE_SYNC_PRODUCTS } from './FindProductBySkuCacheSyncProducts';

export const NAME = 'find-product-category-cache-sync-products';

export default class FindProductCategoryCacheSyncProducts extends AFindProductCategoryCache {

    public getName(): string {
        return NAME;
    }

    protected processFoundSlug(foundSlug: string, dto: ProcessDto): void {
        if (foundSlug) {
            dto.setForceFollowers(FIND_PRODUCT_BY_SKU_CACHE_SYNC_PRODUCTS);

            return;
        }

        dto.setForceFollowers(STORE_RELATION);
    }

}
