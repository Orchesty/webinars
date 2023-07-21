import NodeTester from '@orchesty/nodejs-sdk/dist/test/Testers/NodeTester';
import { mockMysql } from '../../../../test/DataProvider';
import { container } from '../../../../test/TestAbstract';
import { NAME as LIST_ALL_CATEGORIES } from '../ListAllCategories';

let tester: NodeTester;

describe('Tests for ListAllCategories', () => {
    beforeAll(() => {
        tester = new NodeTester(container, __filename);
    });

    it('process - ok', async () => {
        mockMysql();
        await tester.testBatch(LIST_ALL_CATEGORIES);
    });
});
