import ACommonNode from '@orchesty/nodejs-sdk/dist/lib/Commons/ACommonNode';
import ProcessDto from '@orchesty/nodejs-sdk/dist/lib/Utils/ProcessDto';
import { IOutput } from '../../Common/RunProductsTopology';
import { StoredCategoryProductRelationRepository } from '../../Database/StoredCategoryProductRelationRepository';
import { IInput } from '../../WooCommerce/CustomNode/ERPToWooCommerceProductMapper';

export const NAME = 'store-relation';

export default class StoreRelation extends ACommonNode {

    public constructor(
        private readonly storedCategoryProductRelationRepository: StoredCategoryProductRelationRepository,
    ) {
        super();
    }

    public getName(): string {
        return NAME;
    }

    public async processAction(dto: ProcessDto<IInput>): Promise<ProcessDto<IOutput>> {
        const { id, categoryId } = dto.getJsonData();
        await this.storedCategoryProductRelationRepository.insert({
            id: '',
            productId: String(id),
            categoryId: String(categoryId),
        });

        return dto.setNewJsonData({
            ids: [String(categoryId)],
        });
    }

}
