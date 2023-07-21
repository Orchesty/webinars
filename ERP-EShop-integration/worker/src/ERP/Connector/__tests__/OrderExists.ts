import NodeTester from '@orchesty/nodejs-sdk/dist/test/Testers/NodeTester';
import { mockMysql } from '../../../../test/DataProvider';
import { container } from '../../../../test/TestAbstract';
import { NAME as ORDER_EXISTS } from '../OrderExists';

let tester: NodeTester;

describe('Tests for OrderExists', () => {
    beforeAll(() => {
        tester = new NodeTester(container, __filename);
    });

    it('process - does not exists', async () => {
        mockMysql();
        await tester.testConnector(ORDER_EXISTS);
    });
});
