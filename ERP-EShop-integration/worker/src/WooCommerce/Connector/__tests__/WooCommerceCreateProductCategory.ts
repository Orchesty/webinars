import { NAME as WOO_COMMERCE_CREATE_PRODUCT_CATEGORY } from '@orchesty/nodejs-connectors/dist/lib/WooCommerce/Connector/WooCommerceCreateProductCategory';
import NodeTester from '@orchesty/nodejs-sdk/dist/test/Testers/NodeTester';
import { mockWooCommerce } from '../../../../test/DataProvider';
import { container } from '../../../../test/TestAbstract';

let tester: NodeTester;

describe('Tests for WooCommerceCreateProductCategory', () => {
    beforeAll(() => {
        tester = new NodeTester(container, __filename);
    });

    it('process - already exists', async () => {
        mockWooCommerce();
        await tester.testConnector(WOO_COMMERCE_CREATE_PRODUCT_CATEGORY);
    });
});
