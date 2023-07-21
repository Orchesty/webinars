import NodeTester from '@orchesty/nodejs-sdk/dist/test/Testers/NodeTester';
import { mockMysql } from '../../../../test/DataProvider';
import { container } from '../../../../test/TestAbstract';
import { NAME as INSERT_ORDER } from '../InsertOrder';

let tester: NodeTester;

describe('Tests for InsertOrder', () => {
    beforeAll(() => {
        tester = new NodeTester(container, __filename);
    });

    // pro otestovani odstranit z DB jiz existujici radek
    it.skip('process - ok', async () => {
        mockMysql();
        await tester.testConnector(INSERT_ORDER);
    });
});
