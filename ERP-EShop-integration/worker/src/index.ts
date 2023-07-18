import MySqlApplication from '@orchesty/nodejs-connectors/dist/lib/Sql/MySqlApplication';
import WooCommerceCreateProductCategory
    from '@orchesty/nodejs-connectors/dist/lib/WooCommerce/Connector/WooCommerceCreateProductCategory';
import WooCommerceApplication from '@orchesty/nodejs-connectors/dist/lib/WooCommerce/WooCommerceApplication';
import { container, initiateContainer } from '@orchesty/nodejs-sdk';
import DatabaseClient from '@orchesty/nodejs-sdk/dist/lib/Storage/Database/Client';
import Redis from '@orchesty/nodejs-sdk/dist/lib/Storage/Redis/Redis';
import { redis } from './config/config';
import ListAllCategories from './Sql/Batch/ListAllCategories';
import SqlToWooCommerceCategoryMapper from './WooCommerce/CustomNode/SqlToWooCommerceCategoryMapper';

export default function prepare(): void {
    // Load core services by:
    initiateContainer();

    const redisService = new Redis(redis.host);
    container.set(redisService);

    const db = container.get(DatabaseClient);

    const mySqlApplication = new MySqlApplication();
    container.setApplication(mySqlApplication);

    const listAllCategories = new ListAllCategories();
    listAllCategories
        .setDb(db)
        .setApplication(mySqlApplication);
    container.setBatch(listAllCategories);

    const wooCommerceApplication = new WooCommerceApplication();
    container.setApplication(wooCommerceApplication);

    container.setNode(new WooCommerceCreateProductCategory(), wooCommerceApplication);
    container.setNode(new SqlToWooCommerceCategoryMapper());
}
