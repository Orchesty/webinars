import AConnector from '@orchesty/nodejs-sdk/dist/lib/Connector/AConnector';
import { HttpMethods } from '@orchesty/nodejs-sdk/dist/lib/Transport/HttpMethods';
import ProcessDto from '@orchesty/nodejs-sdk/dist/lib/Utils/ProcessDto';

export const NAME = 'find-product-by-sku-cache-sync-products';

export default class FindProductBySkuCacheSyncProducts extends AConnector {

    public getName(): string {
        return NAME;
    }

    // public async processAction(dto: ProcessDto<IInput>): Promise<ProcessDto<IOutput>> {
    public async processAction(dto: ProcessDto): Promise<ProcessDto> {
        const req = await this.getApplication().getRequestDto(
            dto,
            await this.getApplicationInstallFromProcess(dto),
            HttpMethods.GET,
            'endpoint',
        );
        // const resp = await this.getSender().send<IResponse>(req, [200]);
        const resp = await this.getSender().send(req, [200]);

        return dto.setNewJsonData(resp.getJsonBody());
    }

}

// interface IResponse {
//
// }
//
// export interface IInput {
//
// }
//
// export interface IOutput {
//
// }
