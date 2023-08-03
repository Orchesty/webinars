import NodeTester from '@orchesty/nodejs-sdk/dist/test/Testers/NodeTester';
import { container } from '../../../../test/TestAbstract';
import { NAME as RUN_PRODUCTS_TOPOLOGY } from '../RunProductsTopology';

let tester: NodeTester;

describe('Tests for RunProductsTopology', () => {
    beforeAll(() => {
        tester = new NodeTester(container, __filename);
    });

    it('process - ok', async () => {
        await tester.testConnector(RUN_PRODUCTS_TOPOLOGY);
    });
});
