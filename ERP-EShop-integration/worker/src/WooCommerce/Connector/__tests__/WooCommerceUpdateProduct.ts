import { NAME as WOO_COMMERCE_UPDATE_PRODUCT } from '@orchesty/nodejs-connectors/dist/lib/WooCommerce/Connector/WooCommerceUpdateProduct';
import NodeTester from '@orchesty/nodejs-sdk/dist/test/Testers/NodeTester';
import { mockWooCommerce } from '../../../../test/DataProvider';
import { container } from '../../../../test/TestAbstract';

let tester: NodeTester;

describe('Tests for WooCommerceUpdateProduct', () => {
    beforeAll(() => {
        tester = new NodeTester(container, __filename);
    });

    it('process - ok', async () => {
        mockWooCommerce();
        await tester.testConnector(WOO_COMMERCE_UPDATE_PRODUCT);
    });
});
