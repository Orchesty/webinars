import NodeTester from '@orchesty/nodejs-sdk/dist/test/Testers/NodeTester';
import { mockWooCommerce } from '../../../../test/DataProvider';
import { container } from '../../../../test/TestAbstract';
import { NAME as GET_PRODUCT_CATEGORY_CACHE } from '../GetProductCategoryCache';

let tester: NodeTester;

describe('Tests for GetProductCategoryCache', () => {
    beforeAll(() => {
        tester = new NodeTester(container, __filename);
    });

    it('process - found', async () => {
        mockWooCommerce();
        await tester.testConnector(GET_PRODUCT_CATEGORY_CACHE);
    });

    it('process - not found', async () => {
        mockWooCommerce();
        await tester.testConnector(GET_PRODUCT_CATEGORY_CACHE, 'not-found');
    });
});
