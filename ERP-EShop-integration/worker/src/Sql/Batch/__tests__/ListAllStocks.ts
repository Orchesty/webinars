import NodeTester from '@orchesty/nodejs-sdk/dist/test/Testers/NodeTester';
import { mockMysql } from '../../../../test/DataProvider';
import { container } from '../../../../test/TestAbstract';
import { NAME as LIST_ALL_STOCKS } from '../ListAllStocks';

let tester: NodeTester;

describe('Tests for ListAllStocks', () => {
    beforeAll(() => {
        tester = new NodeTester(container, __filename);
    });

    // To reconstruct this test, use limit 10
    it.skip('process - ok', async () => {
        mockMysql();
        await tester.testBatch(LIST_ALL_STOCKS);
    });
});
