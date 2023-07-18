import {
    IInput as IOutput,
} from '@orchesty/nodejs-connectors/dist/lib/WooCommerce/Connector/WooCommerceCreateProductCategory';
import CacheService, { ICacheCallback } from '@orchesty/nodejs-sdk/dist/lib/Cache/CacheService';
import AConnector from '@orchesty/nodejs-sdk/dist/lib/Connector/AConnector';
import { HttpMethods } from '@orchesty/nodejs-sdk/dist/lib/Transport/HttpMethods';
import ProcessDto from '@orchesty/nodejs-sdk/dist/lib/Utils/ProcessDto';
import ResultCode from '@orchesty/nodejs-sdk/dist/lib/Utils/ResultCode';

export const NAME = 'get-product-category-cache';

export default class GetProductCategoryCache extends AConnector {

    public constructor(private readonly cacheService: CacheService) {
        super();
    }

    public getName(): string {
        return NAME;
    }

    public async processAction(dto: ProcessDto<IOutput>): Promise<ProcessDto<IOutput>> {
        const { slug } = dto.getJsonData();
        const req = await this.getApplication().getRequestDto(
            dto,
            await this.getApplicationInstallFromProcess(dto),
            HttpMethods.GET,
            `wp-json/wc/v3/products/categories?slug=${slug}`,
        );

        const foundSlug = await this.cacheService.entry<string>(
            slug ?? '',
            req,
            // eslint-disable-next-line @typescript-eslint/require-await
            async (responseDto): Promise<ICacheCallback<string>> => {
                const { slug: requestedSlug } = (responseDto.getJsonBody() as IOutput[])[0] ?? '';
                return {
                    expire: 3600 * 24,
                    dataToStore: requestedSlug ?? '',
                };
            },
            { success: 200 },
        );

        if (foundSlug) {
            dto.setStopProcess(ResultCode.DO_NOT_CONTINUE, 'Product category was already created!');
        }

        return dto;
    }

}
