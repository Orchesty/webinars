import { IOutput } from '@orchesty/nodejs-connectors/dist/lib/WooCommerce/Batch/WooCommerceGetProducts';
import CacheService, { ICacheCallback } from '@orchesty/nodejs-sdk/dist/lib/Cache/CacheService';
import AConnector from '@orchesty/nodejs-sdk/dist/lib/Connector/AConnector';
import { HttpMethods } from '@orchesty/nodejs-sdk/dist/lib/Transport/HttpMethods';
import ProcessDto from '@orchesty/nodejs-sdk/dist/lib/Utils/ProcessDto';
import ResultCode from '@orchesty/nodejs-sdk/dist/lib/Utils/ResultCode';

export const NAME = 'find-product-by-sku-cache';

export default class FindProductBySkuCache extends AConnector {

    public constructor(private readonly cacheService: CacheService) {
        super();
    }

    public getName(): string {
        return NAME;
    }

    public async processAction(dto: ProcessDto<IOutput>): Promise<ProcessDto<IOutput>> {
        const { sku, ...rest } = dto.getJsonData();
        const req = await this.getApplication().getRequestDto(
            dto,
            await this.getApplicationInstallFromProcess(dto),
            HttpMethods.GET,
            `wp-json/wc/v3/products?sku=${sku}`,
        );

        const foundId = await this.cacheService.entry<string>(
            sku ?? '',
            req,
            // eslint-disable-next-line @typescript-eslint/require-await
            async (responseDto): Promise<ICacheCallback<string>> => ({
                expire: 3600 * 24,
                dataToStore: (responseDto.getJsonBody() as IOutput[])[0]?.id?.toString() ?? '',
            }),
            { success: 200 },
        );

        if (!foundId) {
            dto.setStopProcess(ResultCode.DO_NOT_CONTINUE, 'Product was not found in WooCommerce!');
        } else {
            dto.setNewJsonData({
                ...rest,
                sku,
                id: foundId,
            });
        }

        return dto;
    }

}
