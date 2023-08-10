import ProcessDto from '@orchesty/nodejs-sdk/dist/lib/Utils/ProcessDto';
import TopologyTester from '@orchesty/nodejs-sdk/dist/test/Testers/TopologyTester';
import assert from 'assert';
import { DEFAULT_USER, mockMysql, mockWooCommerce } from '../../../test/DataProvider';
import { container } from '../../../test/TestAbstract';
import { StoredCategoryProductRelationRepository } from '../../Database/StoredCategoryProductRelationRepository';

let tester: TopologyTester;
const topologyPath = `${process.cwd()}/src/topology/category-synchronization.tplg`;

describe('Tests for CategorySynchronization topology', () => {
    beforeAll(() => {
        tester = new TopologyTester(container, __filename, true, ['Activity_1b94jjx', 'Activity_0fg3kk1']);
    });

    it('run CategorySynchronization from Cron', async () => {
        const repository = container.get(StoredCategoryProductRelationRepository);
        await repository.insert({
            id: '0',
            categoryId: '1',
            productId: '1',
        });

        mockMysql();
        mockWooCommerce();
        mockWooCommerce();
        mockWooCommerce();
        mockWooCommerce();
        mockWooCommerce();
        mockWooCommerce();
        mockWooCommerce();
        mockWooCommerce();

        const dto = new ProcessDto();
        dto.setUser(DEFAULT_USER);

        const result = await tester.runTopology(topologyPath, dto, '', 'cron');

        assert.deepEqual(result.length, 16);
        /* eslint-disable @typescript-eslint/naming-convention */
        assert.deepEqual(result[0].getJsonData(), { ids: ['1'] });
        assert.deepEqual(result[1].getJsonData(), { menu_order: 2, name: 'Animation', slug: 'animation' });
        /* eslint-enable @typescript-eslint/naming-convention */
    });
});
