import { container } from '@orchesty/nodejs-sdk';
import NodeTester from '@orchesty/nodejs-sdk/dist/test/Testers/NodeTester';
import { mockMysql } from '../../../../test/DataProvider';
import { NAME as CUSTOMER_EXIST } from '../CustomerExists';

let tester: NodeTester;

describe('Tests for CustomerExists', () => {
    beforeAll(() => {
        tester = new NodeTester(container, __filename);
    });

    it('process - does not exists', async () => {
        mockMysql();
        await tester.testConnector(CUSTOMER_EXIST);
    });

    it('process - exists', async () => {
        mockMysql();
        await tester.testConnector(CUSTOMER_EXIST, 'exists');
    });
});
