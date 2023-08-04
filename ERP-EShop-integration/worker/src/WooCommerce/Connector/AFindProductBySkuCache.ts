import { IOutput } from '@orchesty/nodejs-connectors/dist/lib/WooCommerce/Batch/WooCommerceGetProducts';
import CacheService, { ICacheCallback } from '@orchesty/nodejs-sdk/dist/lib/Cache/CacheService';
import AConnector from '@orchesty/nodejs-sdk/dist/lib/Connector/AConnector';
import { HttpMethods } from '@orchesty/nodejs-sdk/dist/lib/Transport/HttpMethods';
import ProcessDto from '@orchesty/nodejs-sdk/dist/lib/Utils/ProcessDto';

export default abstract class AFindProductBySkuCache extends AConnector {

    public constructor(private readonly cacheService: CacheService) {
        super();
    }

    public async processAction(dto: ProcessDto<IOutput>): Promise<ProcessDto<IOutput>> {
        const { sku } = dto.getJsonData();
        const req = await this.getApplication().getRequestDto(
            dto,
            await this.getApplicationInstallFromProcess(dto),
            HttpMethods.GET,
            `wp-json/wc/v3/products?sku=${sku}`,
        );

        const foundId = await this.cacheService.entry<string>(
            sku ?? '',
            req,
            (responseDto): ICacheCallback<string> => ({
                expire: 3600 * 24,
                dataToStore: (responseDto.getJsonBody() as IOutput[])[0]?.id?.toString() ?? '',
            }),
            { success: 200 },
        );

        this.processFoundId(foundId, dto);

        return dto;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected processFoundId(foundId: string, dto: ProcessDto): void {}

}
