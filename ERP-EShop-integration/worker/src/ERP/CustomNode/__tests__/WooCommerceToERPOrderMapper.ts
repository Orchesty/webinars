import NodeTester from '@orchesty/nodejs-sdk/dist/test/Testers/NodeTester';
import { container } from '../../../../test/TestAbstract';
import { NAME as WOO_COMMERCE_TO_ERP_ORDER_MAPPER } from '../WooCommerceToERPOrderMapper';

let tester: NodeTester;

describe('Tests for WooCommerceToERPOrderMapper', () => {
    beforeAll(() => {
        tester = new NodeTester(container, __filename);
    });

    it('process - ok', async () => {
        await tester.testCustomNode(WOO_COMMERCE_TO_ERP_ORDER_MAPPER);
    });
});
