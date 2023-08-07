import NodeTester from '@orchesty/nodejs-sdk/dist/test/Testers/NodeTester';
import { mockWooCommerce } from '../../../../test/DataProvider';
import { container } from '../../../../test/TestAbstract';
import { NAME as FIND_PRODUCT_BY_SKU_CACHE } from '../FindProductBySkuCacheSyncInventory';

let tester: NodeTester;

describe('Tests for FindProductBySkuCacheSyncInventory', () => {
    beforeAll(() => {
        tester = new NodeTester(container, __filename);
    });

    it('process - ok', async () => {
        mockWooCommerce();
        await tester.testConnector(FIND_PRODUCT_BY_SKU_CACHE);
    });

    it('process - not found', async () => {
        mockWooCommerce();
        await tester.testConnector(FIND_PRODUCT_BY_SKU_CACHE, 'not-found');
    });
});
