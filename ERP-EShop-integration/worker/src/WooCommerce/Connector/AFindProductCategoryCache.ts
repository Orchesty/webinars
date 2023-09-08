import {
    IInput as IOutput,
} from '@orchesty/nodejs-connectors/dist/lib/WooCommerce/Connector/WooCommerceCreateProductCategory';
import CacheService, { ICacheCallback } from '@orchesty/nodejs-sdk/dist/lib/Cache/CacheService';
import AConnector from '@orchesty/nodejs-sdk/dist/lib/Connector/AConnector';
import { HttpMethods } from '@orchesty/nodejs-sdk/dist/lib/Transport/HttpMethods';
import ProcessDto from '@orchesty/nodejs-sdk/dist/lib/Utils/ProcessDto';
import { IInput } from '../CustomNode/ERPToWooCommerceProductMapper';

export default abstract class AFindProductCategoryCache extends AConnector {

    public constructor(private readonly cacheService: CacheService) {
        super();
    }

    public async processAction(dto: ProcessDto<IInput>): Promise<ProcessDto<IOutput>> {
        const { slug, categoryId, ...rest } = dto.getJsonData();
        const req = await this.getApplication().getRequestDto(
            dto,
            await this.getApplicationInstallFromProcess(dto),
            HttpMethods.GET,
            `wp-json/wc/v3/products/categories?slug=${slug}`,
        );

        const foundCategory = await this.cacheService.entry<{ slug?: string; id?: number }>(
            `category_${slug ?? ''}`,
            req,
            (responseDto): ICacheCallback<{ slug?: string; id?: number }> => {
                const { slug: requestedSlug, id } = (responseDto.getJsonBody() as IOutput[])[0] ?? '';
                return {
                    expire: requestedSlug ? 60 * 10 : 0,
                    dataToStore: { slug: requestedSlug, id },
                };
            },
            { success: 200 },
        );

        await this.processFoundSlug(foundCategory?.slug ?? '', dto);

        return dto.setNewJsonData({
            ...rest,
            slug,
            categoryId: foundCategory.id ?? categoryId,
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected async processFoundSlug(foundSlug: string, dto: ProcessDto): Promise<void> {}

}
