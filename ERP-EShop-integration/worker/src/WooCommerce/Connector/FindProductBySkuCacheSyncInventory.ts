import { IOutput } from '@orchesty/nodejs-connectors/dist/lib/WooCommerce/Batch/WooCommerceGetProducts';
import ProcessDto from '@orchesty/nodejs-sdk/dist/lib/Utils/ProcessDto';
import ResultCode from '@orchesty/nodejs-sdk/dist/lib/Utils/ResultCode';
import AFindProductBySkuCache from './AFindProductBySkuCache';

export const NAME = 'find-product-by-sku-cache-sync-inventory';

export default class FindProductBySkuCacheSyncInventory extends AFindProductBySkuCache {

    public getName(): string {
        return NAME;
    }

    protected processFoundId(foundId: string, dto: ProcessDto<IOutput>): void {
        const data = dto.getJsonData();
        if (!foundId) {
            dto.setStopProcess(ResultCode.DO_NOT_CONTINUE, 'Product was not found in WooCommerce!');
        } else {
            dto.setNewJsonData({
                ...data,
                id: foundId,
            });
        }
    }

}
