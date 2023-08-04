import RunTopologyBase from '@orchesty/nodejs-connectors/dist/lib/Common/RunTopology/RunTopology';
import { IInput } from '@orchesty/nodejs-connectors/dist/lib/WooCommerce/Connector/WooCommerceCreateProductCategory';
import TopologyRunner from '@orchesty/nodejs-sdk/dist/lib/Topology/TopologyRunner';
import ProcessDto from '@orchesty/nodejs-sdk/dist/lib/Utils/ProcessDto';
import ResultCode from '@orchesty/nodejs-sdk/dist/lib/Utils/ResultCode';
import { StoredCategoryProductRelationRepository } from '../Database/StoredCategoryProductRelationRepository';

export default class RunProductsTopology extends RunTopologyBase {

    public constructor(
        private readonly storedCategoryProductRelationRepository: StoredCategoryProductRelationRepository,
        runner: TopologyRunner,
        topology: string,
        node: string,
    ) {
        super(runner, topology, node);
    }

    public async processAction(dto: ProcessDto<IInput>): Promise<ProcessDto<IInput | IOutput>> {
        const categoryId = String(dto.getJsonData().menu_order);

        let foundCategory;
        if (categoryId !== undefined) {
            const query = {
                categoryId,
            };

            foundCategory = await this.storedCategoryProductRelationRepository.findOne(query);

            if (foundCategory) {
                await this.storedCategoryProductRelationRepository.delete(query);
                dto.setNewJsonData({ ids: [foundCategory.productId] });

                return await super.processAction(dto) as unknown as ProcessDto<IOutput>;
            }
        }

        dto.setStopProcess(ResultCode.DO_NOT_CONTINUE, '');
        return dto;
    }

}

export interface IOutput {
    ids?: string[];
}
