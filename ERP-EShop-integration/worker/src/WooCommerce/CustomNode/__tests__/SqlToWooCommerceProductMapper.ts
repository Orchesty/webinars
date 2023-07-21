import NodeTester from '@orchesty/nodejs-sdk/dist/test/Testers/NodeTester';
import { container } from '../../../../test/TestAbstract';
import { NAME as SQL_TO_WOO_COMMERCE_PRODUCT_MAPPER } from '../SqlToWooCommerceProductMapper';

let tester: NodeTester;

describe('Tests for SqlToWooCommerceProductMapper', () => {
    beforeAll(() => {
        tester = new NodeTester(container, __filename);
    });

    it('process - ok', async () => {
        await tester.testCustomNode(SQL_TO_WOO_COMMERCE_PRODUCT_MAPPER);
    });
});
