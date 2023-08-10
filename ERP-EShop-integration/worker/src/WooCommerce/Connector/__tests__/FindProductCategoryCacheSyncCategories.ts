import NodeTester from '@orchesty/nodejs-sdk/dist/test/Testers/NodeTester';
import { mockWooCommerce } from '../../../../test/DataProvider';
import { container } from '../../../../test/TestAbstract';
import { StoredCategoryProductRelationRepository } from '../../../Database/StoredCategoryProductRelationRepository';
import { NAME as FIND_PRODUCT_CATEGORY_CACHE_SYNC_CATEGORIES } from '../FindProductCategoryCacheSyncCategories';

let tester: NodeTester;

describe('Tests for FindProductCategoryCacheSyncCategories', () => {
    beforeAll(() => {
        tester = new NodeTester(container, __filename);
    });

    it('process - found', async () => {
        mockWooCommerce();
        await tester.testConnector(FIND_PRODUCT_CATEGORY_CACHE_SYNC_CATEGORIES);
    });

    it('process - not found', async () => {
        mockWooCommerce();
        await tester.testConnector(FIND_PRODUCT_CATEGORY_CACHE_SYNC_CATEGORIES, 'not-found');
    });

    it('process - found but stored', async () => {
        const repository = container.get(StoredCategoryProductRelationRepository);
        await repository.insert({
            id: '0',
            categoryId: '1',
            productId: '1',
        });
        mockWooCommerce();
        await tester.testConnector(FIND_PRODUCT_CATEGORY_CACHE_SYNC_CATEGORIES, 'stored');
    });
});
