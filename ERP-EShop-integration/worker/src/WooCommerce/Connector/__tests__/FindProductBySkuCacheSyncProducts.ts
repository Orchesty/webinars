import NodeTester from '@orchesty/nodejs-sdk/dist/test/Testers/NodeTester';
import { container } from '../../../../test/TestAbstract';
import { NAME as FIND_PRODUCT_BY_SKU_CACHE_SYNC_PRODUCTS } from '../FindProductBySkuCacheSyncProducts';

let tester: NodeTester;

describe('Tests for FindProductBySkuCacheSyncProducts', () => {
    beforeAll(() => {
        tester = new NodeTester(container, __filename);
    });

    it('process - ok', async () => {
        await tester.testConnector(FIND_PRODUCT_BY_SKU_CACHE_SYNC_PRODUCTS);
    });
});
