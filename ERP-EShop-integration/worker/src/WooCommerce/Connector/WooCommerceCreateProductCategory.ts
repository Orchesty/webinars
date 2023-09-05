import WooCommerceCreateProductCategoryBase from '@orchesty/nodejs-connectors/dist/lib/WooCommerce/Connector/WooCommerceCreateProductCategory';
import ResponseDto from '@orchesty/nodejs-sdk/dist/lib/Transport/Curl/ResponseDto';
import { IResultRanges } from '@orchesty/nodejs-sdk/dist/lib/Transport/Curl/ResultCodeRange';
import ProcessDto from '@orchesty/nodejs-sdk/dist/lib/Utils/ProcessDto';

export default class WooCommerceCreateProductCategory extends WooCommerceCreateProductCategoryBase {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected setNewJsonData(dto: ProcessDto, resp: ResponseDto): ProcessDto {
        return dto;
    }

    protected getCodeRanges(): IResultRanges {
        return {
            success: [200, 400],
        };
    }

}
