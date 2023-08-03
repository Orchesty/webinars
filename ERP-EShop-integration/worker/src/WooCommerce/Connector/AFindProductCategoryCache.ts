import {
    IInput as IOutput,
} from '@orchesty/nodejs-connectors/dist/lib/WooCommerce/Connector/WooCommerceCreateProductCategory';
import CacheService, { ICacheCallback } from '@orchesty/nodejs-sdk/dist/lib/Cache/CacheService';
import AConnector from '@orchesty/nodejs-sdk/dist/lib/Connector/AConnector';
import { HttpMethods } from '@orchesty/nodejs-sdk/dist/lib/Transport/HttpMethods';
import ProcessDto from '@orchesty/nodejs-sdk/dist/lib/Utils/ProcessDto';

// TODO rich refactor na find
export default abstract class AFindProductCategoryCache extends AConnector {

    public constructor(private readonly cacheService: CacheService) {
        super();
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
            (responseDto): ICacheCallback<string> => {
                const { slug: requestedSlug } = (responseDto.getJsonBody() as IOutput[])[0] ?? '';
                return {
                    expire: 3600 * 24,
                    dataToStore: requestedSlug ?? '',
                };
            },
            { success: 200 },
        );

        this.processFoundSlug(foundSlug, dto);

        return dto;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected processFoundSlug(foundSlug: string, dto: ProcessDto): void {}

}
