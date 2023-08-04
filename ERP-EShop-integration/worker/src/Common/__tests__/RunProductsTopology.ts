import NodeTester from '@orchesty/nodejs-sdk/dist/test/Testers/NodeTester';
import { container } from '../../../test/TestAbstract';
import { StoredCategoryProductRelationRepository } from '../../Database/StoredCategoryProductRelationRepository';

let tester: NodeTester;

// TODO rich doplnit
const RUN_TOPOLOGY = '-cron-run-topology';

describe('Tests for RunProductsTopology', () => {
    beforeAll(() => {
        tester = new NodeTester(container, __filename);
    });

    it('process - ok', async () => {
        await tester.testConnector(RUN_TOPOLOGY);
    });

    it('process - found', async () => {
        const repository = container.get(StoredCategoryProductRelationRepository);
        await repository.insert({
            id: '0',
            categoryId: '0',
            productId: '0',
        });

        await tester.testConnector(RUN_TOPOLOGY, 'found');
    });
});
