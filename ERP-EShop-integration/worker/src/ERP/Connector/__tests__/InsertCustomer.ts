import NodeTester from '@orchesty/nodejs-sdk/dist/test/Testers/NodeTester';
import { mockMysql } from '../../../../test/DataProvider';
import { container } from '../../../../test/TestAbstract';
import { NAME as INSERT_CUSTOMER } from '../InsertCustomer';

let tester: NodeTester;

describe('Tests for InsertCustomer', () => {
    beforeAll(() => {
        tester = new NodeTester(container, __filename);
    });

    // pro otestovani odstranit z DB jiz existujici radek
    it.skip('process - ok', async () => {
        mockMysql();
        await tester.testConnector(INSERT_CUSTOMER);
    });
});
