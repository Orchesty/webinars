import { IInput } from '@orchesty/nodejs-connectors/dist/lib/WooCommerce/Connector/WooCommerceCreateProductCategory';
import ProcessDto from '@orchesty/nodejs-sdk/dist/lib/Utils/ProcessDto';
import StoredCategoryProductRelationEntity from '../Database/StoredCategoryProductRelationEntity';
import ARunTopology from './ARunTopology';

export const NAME = 'run-products-topology';

export default class RunProductsTopology extends ARunTopology {

    public getName(): string {
        return NAME;
    }

    protected getCategoryId(dto: ProcessDto<IInput>): string | undefined {
        return String(dto.getJsonData().menu_order);
    }

    // TODO rich pokracovat
    protected setNewJsonData(dto: ProcessDto, foundCategory: StoredCategoryProductRelationEntity): void {
        dto.setNewJsonData({ ids: [foundCategory.productId] });
    }

}
