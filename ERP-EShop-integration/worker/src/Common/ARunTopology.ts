import RunTopologyBase from '@orchesty/nodejs-connectors/dist/lib/Common/RunTopology/RunTopology';
import { IInput } from '@orchesty/nodejs-connectors/dist/lib/WooCommerce/Connector/WooCommerceCreateProductCategory';
import TopologyRunner from '@orchesty/nodejs-sdk/dist/lib/Topology/TopologyRunner';
import ProcessDto from '@orchesty/nodejs-sdk/dist/lib/Utils/ProcessDto';
import ResultCode from '@orchesty/nodejs-sdk/dist/lib/Utils/ResultCode';
import StoredCategoryProductRelationEntity from '../Database/StoredCategoryProductRelationEntity';
import { StoredCategoryProductRelationRepository } from '../Database/StoredCategoryProductRelationRepository';

export default abstract class ARunTopology extends RunTopologyBase {

    public constructor(
        private readonly storedCategoryProductRelationRepository: StoredCategoryProductRelationRepository,
        runner: TopologyRunner,
        topology: string,
        node: string,
    ) {
        super(runner, topology, node);
    }

    public async processAction(dto: ProcessDto<IInput>): Promise<ProcessDto<IInput | IOutput>> {
        const categoryId = this.getCategoryId(dto);

        let foundCategory;
        if (categoryId !== undefined) {
            const query = {
                categoryId,
            };

            foundCategory = await this.storedCategoryProductRelationRepository.findOne(query);

            if (foundCategory) {
                await this.storedCategoryProductRelationRepository.delete(query);
                this.setNewJsonData(dto, foundCategory);

                return await super.processAction(dto) as unknown as ProcessDto<IOutput>;
            }
        }

        dto.setStopProcess(ResultCode.DO_NOT_CONTINUE, '');
        return dto;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected getCategoryId(dto: ProcessDto): string | undefined {
        return undefined;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected setNewJsonData(dto: ProcessDto, foundCategory: StoredCategoryProductRelationEntity): void {}

}

export interface IOutput {
    ids?: string[];
}
