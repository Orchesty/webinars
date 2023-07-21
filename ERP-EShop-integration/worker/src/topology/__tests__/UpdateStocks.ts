import ProcessDto from '@orchesty/nodejs-sdk/dist/lib/Utils/ProcessDto';
import TopologyTester from '@orchesty/nodejs-sdk/dist/test/Testers/TopologyTester';
import assert from 'assert';
import { DEFAULT_USER, mockMysql, mockWooCommerce } from '../../../test/DataProvider';
import { container } from '../../../test/TestAbstract';

let tester: TopologyTester;
const topologyPath = `${process.cwd()}/src/topology/update-stocks.tplg`;

describe('Tests for UpdateStocks topology', () => {
    beforeAll(() => {
        tester = new TopologyTester(container, __filename, true, ['Activity_1263zgj', 'Activity_1cqa8rn']);
    });

    // To reconstruct this test, use limit 1 in ListAllStocks
    it.skip('run UpdateStocks from Cron', async () => {
        mockMysql();
        mockWooCommerce();

        const dto = new ProcessDto();
        dto.setUser(DEFAULT_USER);

        const result = await tester.runTopology(topologyPath, dto, '', 'cron');

        assert.deepEqual(result.length, 1);
        /* eslint-disable @typescript-eslint/naming-convention */
        assert.deepEqual(result[0].getJsonData(), {
            _links: {
                collection: [
                    {
                        href: 'https://example.com/wp-json/wc/v3/products',
                    },
                ],
                self: [
                    {
                        href: 'https://example.com/wp-json/wc/v3/products/794',
                    },
                ],
            },
            attributes: [],
            average_rating: '0.00',
            backordered: false,
            backorders: 'no',
            backorders_allowed: false,
            button_text: '',
            catalog_visibility: 'visible',
            categories: [
                {
                    id: 9,
                    name: 'Clothing',
                    slug: 'clothing',
                },
                {
                    id: 14,
                    name: 'T-shirts',
                    slug: 't-shirts',
                },
            ],
            cross_sell_ids: [],
            date_created: '2017-03-23T17:01:14',
            date_created_gmt: '2017-03-23T20:01:14',
            date_modified: '2017-03-23T17:01:14',
            date_modified_gmt: '2017-03-23T20:01:14',
            date_on_sale_from: null,
            date_on_sale_from_gmt: null,
            date_on_sale_to: null,
            date_on_sale_to_gmt: null,
            default_attributes: [],
            description: '<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>\n',
            dimensions: {
                height: '',
                length: '',
                width: '',
            },
            download_expiry: -1,
            download_limit: -1,
            downloadable: false,
            downloads: [],
            external_url: '',
            featured: false,
            grouped_products: [],
            id: 794,
            images: [
                {
                    alt: '',
                    date_created: '2017-03-23T14:01:13',
                    date_created_gmt: '2017-03-23T20:01:13',
                    date_modified: '2017-03-23T14:01:13',
                    date_modified_gmt: '2017-03-23T20:01:13',
                    id: 792,
                    name: '',
                    src: 'https://example.com/wp-content/uploads/2017/03/T_2_front-4.jpg',
                },
                {
                    alt: '',
                    date_created: '2017-03-23T14:01:14',
                    date_created_gmt: '2017-03-23T20:01:14',
                    date_modified: '2017-03-23T14:01:14',
                    date_modified_gmt: '2017-03-23T20:01:14',
                    id: 793,
                    name: '',
                    src: 'https://example.com/wp-content/uploads/2017/03/T_2_back-2.jpg',
                },
            ],
            manage_stock: false,
            menu_order: 0,
            meta_data: [],
            name: 'Premium Quality',
            on_sale: false,
            parent_id: 0,
            permalink: 'https://example.com/product/premium-quality-19/',
            price: '24.54',
            price_html: '<span class="woocommerce-Price-amount amount"><span class="woocommerce-Price-currencySymbol">&#36;</span>24.54</span>',
            purchasable: true,
            purchase_note: '',
            rating_count: 0,
            regular_price: '24.54',
            related_ids: [
                479,
                387,
                22,
                463,
                396,
            ],
            reviews_allowed: true,
            sale_price: '',
            shipping_class: '',
            shipping_class_id: 0,
            shipping_required: true,
            shipping_taxable: true,
            short_description: '<p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>\n',
            sku: '',
            slug: 'premium-quality-19',
            sold_individually: false,
            status: 'publish',
            stock_quantity: null,
            stock_status: 'instock',
            tags: [],
            tax_class: '',
            tax_status: 'taxable',
            total_sales: 0,
            type: 'simple',
            upsell_ids: [],
            variations: [],
            virtual: false,
            weight: '',
        });
        /* eslint-enable @typescript-eslint/naming-convention */
    });
});
