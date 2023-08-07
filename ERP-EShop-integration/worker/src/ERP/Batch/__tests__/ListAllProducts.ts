import NodeTester from '@orchesty/nodejs-sdk/dist/test/Testers/NodeTester';
import { mockMysql } from '../../../../test/DataProvider';
import { container } from '../../../../test/TestAbstract';
import { LAST_RUN_KEY, NAME as LIST_ALL_PRODUCTS } from '../ListAllProducts';

let tester: NodeTester;

describe('Tests for ListAllProducts', () => {
    beforeAll(() => {
        tester = new NodeTester(container, __filename);
    });

    // Could not be reconstructed because of too much rows
    it.skip('process - ok', async () => {
        mockMysql();
        mockMysql();
        await tester.testBatch(LIST_ALL_PRODUCTS);
    });

    it('process - with ids', async () => {
        mockMysql();
        await tester.testBatch(LIST_ALL_PRODUCTS, 'ids');
    });

    it('process - last run', async () => {
        mockMysql({
            [LAST_RUN_KEY]: new Date(),
        });
        await tester.testBatch(LIST_ALL_PRODUCTS, 'last-run');
    });
});
