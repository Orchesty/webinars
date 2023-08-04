import ASqlBatchConnector from '@orchesty/nodejs-connectors/dist/lib/Sql/Common/ASqlBatchConnector';
import BatchProcessDto from '@orchesty/nodejs-sdk/dist/lib/Utils/BatchProcessDto';
import { IOutput as IRunTopologyInput } from '../../Common/RunProductsTopology';
import { IInput } from './ListAllCategories';

export const NAME = 'list-all-products';

export const LAST_RUN_KEY = 'lastRunListProducts';
const LIMIT = 1000;

export default class ListAllProducts extends ASqlBatchConnector {

    protected name = NAME;

    public getName(): string {
        return this.name;
    }

    protected async getQuery(processDto: BatchProcessDto<IRunTopologyInput>): Promise<string> {
        const offset = processDto.getBatchCursor('0');
        const appInstall = await this.getApplicationInstallFromProcess(processDto);

        const date = appInstall.getNonEncryptedSettings()[LAST_RUN_KEY] ?? new Date(0).toISOString();
        const lastRun = date.slice(0, 19).replace('T', ' ');
        const { ids } = processDto.getJsonData();

        let baseQuery = `SELECT p.PROD_ID as \`id\`,
                              p.TITLE          as name,
                              p.PRICE          as price,
                              p.COMMON_PROD_ID as sku,
                              p.CREATED        as date_created,
                              c.CATEGORYNAME   as slug,
                              c.CATEGORY       as categoryId
                       FROM \`products\` p LEFT JOIN \`categories\` c
                       ON p.CATEGORY = c.CATEGORY
                       WHERE p.CREATED > '${lastRun}'`;

        if (ids) {
            baseQuery += ` AND p.PROD_ID IN (${ids})`;
        }

        baseQuery += ` LIMIT ${LIMIT} OFFSET ${offset}`;

        // TODO rich doresit testy
        // TODO rich vyresit last run
        return String(baseQuery);
    }

    protected async processResult(res: IInput, dto: BatchProcessDto): Promise<BatchProcessDto> {
        dto.setItemList(res.rows);
        const appInstall = await this.getApplicationInstallFromProcess(dto);

        if (res.rows.length < LIMIT) {
            appInstall.addNonEncryptedSettings({ [LAST_RUN_KEY]: new Date() });
            await this.getDbClient().getApplicationRepository().update(appInstall);
        } else {
            const offset = dto.getBatchCursor('0');
            dto.setBatchCursor(String(Number(offset) + LIMIT));
        }

        return dto;
    }

}
