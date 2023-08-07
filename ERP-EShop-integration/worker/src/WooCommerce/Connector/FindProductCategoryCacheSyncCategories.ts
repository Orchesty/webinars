import ProcessDto from '@orchesty/nodejs-sdk/dist/lib/Utils/ProcessDto';
import ResultCode from '@orchesty/nodejs-sdk/dist/lib/Utils/ResultCode';
import AFindProductCategoryCache from './AFindProductCategoryCache';

export const NAME = 'find-product-category-cache-sync-categories';

export default class FindProductCategoryCacheSyncCategories extends AFindProductCategoryCache {

    public getName(): string {
        return NAME;
    }

    protected processFoundSlug(foundSlug: string, dto: ProcessDto): void {
        if (foundSlug) {
            dto.setStopProcess(ResultCode.DO_NOT_CONTINUE, 'Product category was already created!');
        }
    }

}
