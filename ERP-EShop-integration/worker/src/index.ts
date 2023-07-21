import MySqlApplication from '@orchesty/nodejs-connectors/dist/lib/Sql/MySqlApplication';
import WooCommerceCreateProductCategory
    from '@orchesty/nodejs-connectors/dist/lib/WooCommerce/Connector/WooCommerceCreateProductCategory';
import WooCommerceApplication from '@orchesty/nodejs-connectors/dist/lib/WooCommerce/WooCommerceApplication';
import { container, initiateContainer } from '@orchesty/nodejs-sdk';
import CacheService from '@orchesty/nodejs-sdk/dist/lib/Cache/CacheService';
import DatabaseClient from '@orchesty/nodejs-sdk/dist/lib/Storage/Database/Client';
import Redis from '@orchesty/nodejs-sdk/dist/lib/Storage/Redis/Redis';
import CurlSender from '@orchesty/nodejs-sdk/dist/lib/Transport/Curl/CurlSender';
import { redis } from './config/config';
import ListAllCategories from './Sql/Batch/ListAllCategories';
import GetProductCategoryCache from './WooCommerce/Connector/GetProductCategoryCache';
import SqlToWooCommerceCategoryMapper from './WooCommerce/CustomNode/SqlToWooCommerceCategoryMapper';

export default function prepare(): void {
    // Load core services by:
    initiateContainer();

    const redisService = new Redis(redis.host);
    container.set(redisService);
    const curlService = container.get(CurlSender);
    const cacheService = new CacheService(redisService, curlService);
    container.set(cacheService);

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
    container.setNode(new GetProductCategoryCache(cacheService), wooCommerceApplication);
}
