import NodeTester from '@orchesty/nodejs-sdk/dist/test/Testers/NodeTester';
import { mockWooCommerce } from '../../../../test/DataProvider';
import { container } from '../../../../test/TestAbstract';
import { NAME as FIND_PRODUCT_CATEGORY_CACHE_SYNC_PRODUCTS } from '../FindProductCategoryCacheSyncProducts';

let tester: NodeTester;

describe('Tests for FindProductCategoryCacheSyncProducts', () => {
    beforeAll(() => {
        tester = new NodeTester(container, __filename);
    });

    it('process - ok', async () => {
        mockWooCommerce();
        await tester.testConnector(FIND_PRODUCT_CATEGORY_CACHE_SYNC_PRODUCTS);
    });

    it('process - not found', async () => {
        mockWooCommerce();
        await tester.testConnector(FIND_PRODUCT_CATEGORY_CACHE_SYNC_PRODUCTS, 'not-found');
    });
});
