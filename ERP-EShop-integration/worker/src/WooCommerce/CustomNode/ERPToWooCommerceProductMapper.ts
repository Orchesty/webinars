import { IOutput } from '@orchesty/nodejs-connectors/dist/lib/WooCommerce/Batch/WooCommerceGetProducts';
import ACommonNode from '@orchesty/nodejs-sdk/dist/lib/Commons/ACommonNode';
import ProcessDto from '@orchesty/nodejs-sdk/dist/lib/Utils/ProcessDto';
import ResultCode from '@orchesty/nodejs-sdk/dist/lib/Utils/ResultCode';
import { IOutput as IInput } from '../../ERP/Batch/ListAllStocks';

export const NAME = 'erp-to-woo-commerce-product-mapper';

export default class ERPToWooCommerceProductMapper extends ACommonNode {

    public getName(): string {
        return NAME;
    }

    public processAction(dto: ProcessDto<IInput>): ProcessDto<IInput | IOutput> {
        const { stockQuantity, sales, sku } = dto.getJsonData();

        if (!sku) {
            dto.setStopProcess(ResultCode.DO_NOT_CONTINUE, 'Product was not found in DB!');

            return dto;
        }

        /* eslint-disable @typescript-eslint/naming-convention */
        return dto.setNewJsonData({
            sku: String(sku),
            stock_quantity: stockQuantity,
            total_sales: sales,
        });
        /* eslint-enable @typescript-eslint/naming-convention */
    }

}
