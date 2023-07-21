import Base from '@orchesty/nodejs-connectors/dist/lib/WooCommerce/Connector/WooCommerceUpdateProduct';
import { IResultRanges } from '@orchesty/nodejs-sdk/dist/lib/Transport/Curl/ResultCodeRange';

export default class WooCommerceUpdateProduct extends Base {

    protected getCodeRanges(): IResultRanges {
        return {
            success: ['<300', 404],
            stopAndFail: ['300-404', '405-429', '430-500'],
            repeat: [408, 429, '>=500'],
        };
    }

}
