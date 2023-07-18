import ProcessDto from '@orchesty/nodejs-sdk/dist/lib/Utils/ProcessDto';
import TopologyTester from '@orchesty/nodejs-sdk/dist/test/Testers/TopologyTester';
import assert from 'assert';
import { DEFAULT_USER, mockMysql, mockWooCommerce } from '../../../test/DataProvider';
import { container } from '../../../test/TestAbstract';

let tester: TopologyTester;
const topologyPath = `${process.cwd()}/src/topology/category-synchronization.tplg`;

describe('Tests for CategorySynchronization topology', () => {
    beforeAll(() => {
        tester = new TopologyTester(container, __filename, true, ['Activity_1b94jjx', 'Activity_0fg3kk1']);
    });

    it('run CategorySynchronization from Cron', async () => {
        mockMysql();
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
        assert.deepEqual(result[0].getJsonData(), {
            _links: {
                collection: [{ href: 'https://example.com/wp-json/wc/v3/products/categories' }],
                self: [{ href: 'https://example.com/wp-json/wc/v3/products/categories/9' }],
            },
            count: 36,
            description: '',
            display: 'default',
            id: 9,
            image: {
                alt: '',
                date_created: '2017-03-23T00:01:07',
                date_created_gmt: '2017-03-23T03:01:07',
                date_modified: '2017-03-23T00:01:07',
                date_modified_gmt: '2017-03-23T03:01:07',
                id: 730,
                name: '',
                src: 'https://example.com/wp-content/uploads/2017/03/T_2_front.jpg',
            },
            menu_order: 0,
            name: 'Clothing',
            parent: 0,
            slug: 'clothing',
        });
        /* eslint-enable @typescript-eslint/naming-convention */
    });
});
