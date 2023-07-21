import NodeTester from '@orchesty/nodejs-sdk/dist/test/Testers/NodeTester';
import { container } from '../../../../test/TestAbstract';
import { NAME as ERP_TO_WOO_COMMERCE_CATEGORY_MAPPER } from '../ERPToWooCommerceCategoryMapper';

let tester: NodeTester;

describe('Tests for ERPToWooCommerceCategoryMapper', () => {
    beforeAll(() => {
        tester = new NodeTester(container, __filename);
    });

    it('process - ok', async () => {
        await tester.testCustomNode(ERP_TO_WOO_COMMERCE_CATEGORY_MAPPER);
    });
});
