import {
    IInput as IOutput,
} from '@orchesty/nodejs-connectors/dist/lib/WooCommerce/Connector/WooCommerceCreateProductCategory';
import ACommonNode from '@orchesty/nodejs-sdk/dist/lib/Commons/ACommonNode';
import ProcessDto from '@orchesty/nodejs-sdk/dist/lib/Utils/ProcessDto';
// TODO rich vyresit
// eslint-disable-next-line import/no-extraneous-dependencies
import slugify from 'slugify';
import { IOutput as IInput } from '../../Sql/Batch/ListAllCategories';

export const NAME = 'sql-to-woo-commerce-category-mapper';

export default class SqlToWooCommerceCategoryMapper extends ACommonNode {

    public getName(): string {
        return NAME;
    }

    public processAction(dto: ProcessDto<IInput>): ProcessDto<IOutput> {
        const { category, categoryName } = dto.getJsonData();

        /* eslint-disable @typescript-eslint/naming-convention */
        return dto.setNewJsonData({
            name: categoryName,
            menu_order: category,
            slug: slugify(categoryName).toLowerCase(),
        });
        /* eslint-enable @typescript-eslint/naming-convention */
    }

}
