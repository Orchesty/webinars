import NodeTester from '@orchesty/nodejs-sdk/dist/test/Testers/NodeTester';
import { container } from '../../../../test/TestAbstract';
import { NAME as STORE_RELATION } from '../StoreRelation';

let tester: NodeTester;

describe('Tests for StoreRelation', () => {
    beforeAll(() => {
        tester = new NodeTester(container, __filename);
    });

    it('process - ok', async () => {
        await tester.testCustomNode(STORE_RELATION);
    });
});
