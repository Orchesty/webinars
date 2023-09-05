import {
    IInput as IOutput,
} from '@orchesty/nodejs-connectors/dist/lib/WooCommerce/Connector/WooCommerceCreateProductCategory';
import CacheService from '@orchesty/nodejs-sdk/dist/lib/Cache/CacheService';
import ProcessDto from '@orchesty/nodejs-sdk/dist/lib/Utils/ProcessDto';
import ResultCode from '@orchesty/nodejs-sdk/dist/lib/Utils/ResultCode';
import { StoredCategoryProductRelationRepository } from '../../Database/StoredCategoryProductRelationRepository';
import AFindProductCategoryCache from './AFindProductCategoryCache';

export const NAME = 'find-product-category-cache-sync-categories';

export default class FindProductCategoryCacheSyncCategories extends AFindProductCategoryCache {

    public constructor(
        private readonly storedCategoryProductRelationRepository: StoredCategoryProductRelationRepository,
        cacheService: CacheService,
    ) {
        super(cacheService);
    }

    public getName(): string {
        return NAME;
    }

    protected async processFoundSlug(foundSlug: string, dto: ProcessDto<IOutput>): Promise<void> {
        const { menu_order } = dto.getJsonData();

        const stored = await this.storedCategoryProductRelationRepository.findOne({
            categoryId: String(menu_order),
        });

        if (foundSlug && !stored) {
            dto.setStopProcess(ResultCode.DO_NOT_CONTINUE, 'Product category was already created!');
        }
    }

}
