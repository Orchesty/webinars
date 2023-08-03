import NodeTester from '@orchesty/nodejs-sdk/dist/test/Testers/NodeTester';
import { container } from '../../../../test/TestAbstract';
import { NAME as RUN_CATEGORIES_TOPOLOGY } from '../RunCategoriesTopology';

let tester: NodeTester;

describe('Tests for RunCategoriesTopology', () => {
    beforeAll(() => {
        tester = new NodeTester(container, __filename);
    });

    it('process - ok', async () => {
        await tester.testConnector(RUN_CATEGORIES_TOPOLOGY);
    });
});
