import MySqlApplication from '@orchesty/nodejs-connectors/dist/lib/Sql/MySqlApplication';
import WooCommerceGetOrders from '@orchesty/nodejs-connectors/dist/lib/WooCommerce/Batch/WooCommerceGetOrders';
import WooCommerceCreateProductCategory
    from '@orchesty/nodejs-connectors/dist/lib/WooCommerce/Connector/WooCommerceCreateProductCategory';
import WooCommerceApplication from '@orchesty/nodejs-connectors/dist/lib/WooCommerce/WooCommerceApplication';
import { container, initiateContainer } from '@orchesty/nodejs-sdk';
import CacheService from '@orchesty/nodejs-sdk/dist/lib/Cache/CacheService';
import { ICommonNode } from '@orchesty/nodejs-sdk/dist/lib/Commons/ICommonNode';
import DatabaseClient from '@orchesty/nodejs-sdk/dist/lib/Storage/Database/Client';
import Redis from '@orchesty/nodejs-sdk/dist/lib/Storage/Redis/Redis';
import CurlSender from '@orchesty/nodejs-sdk/dist/lib/Transport/Curl/CurlSender';
import { redis } from './config/config';
import ListAllCategories from './ERP/Batch/ListAllCategories';
import ListAllStocks from './ERP/Batch/ListAllStocks';
import CustomerExists from './ERP/Connector/CustomerExists';
import InsertCustomer from './ERP/Connector/InsertCustomer';
import InsertOrder from './ERP/Connector/InsertOrder';
import InsertOrderLine from './ERP/Connector/InsertOrderLine';
import OrderExists from './ERP/Connector/OrderExists';
import WooCommerceToERPOrderMapper from './ERP/CustomNode/WooCommerceToERPOrderMapper';
import FindProductBySkuCache from './WooCommerce/Connector/FindProductBySkuCache';
import GetProductCategoryCache from './WooCommerce/Connector/GetProductCategoryCache';
import WooCommerceUpdateProduct from './WooCommerce/Connector/WooCommerceUpdateProduct';
import ERPToWooCommerceCategoryMapper from './WooCommerce/CustomNode/ERPToWooCommerceCategoryMapper';
import ERPToWooCommerceProductMapper from './WooCommerce/CustomNode/ERPToWooCommerceProductMapper';

function initializeERP(): void {
    const mySqlApplication = new MySqlApplication();
    container.setApplication(mySqlApplication);

    const db = container.get(DatabaseClient);

    const listAllCategories = new ListAllCategories();
    listAllCategories
        .setDb(db)
        .setApplication(mySqlApplication);
    container.setBatch(listAllCategories);

    const listAllStocks = new ListAllStocks();
    listAllStocks
        .setDb(db)
        .setApplication(mySqlApplication);
    container.setBatch(listAllStocks);

    const customerExists = new CustomerExists();
    customerExists
        .setDb(db)
        .setApplication(mySqlApplication);
    container.setConnector(customerExists as unknown as ICommonNode);

    const insertCustomer = new InsertCustomer();
    insertCustomer
        .setDb(db)
        .setApplication(mySqlApplication);
    container.setConnector(insertCustomer as unknown as ICommonNode);

    const insertOrder = new InsertOrder();
    insertOrder
        .setDb(db)
        .setApplication(mySqlApplication);
    container.setConnector(insertOrder as unknown as ICommonNode);

    const orderExists = new OrderExists();
    orderExists
        .setDb(db)
        .setApplication(mySqlApplication);
    container.setConnector(orderExists as unknown as ICommonNode);

    const insertOrderLine = new InsertOrderLine();
    insertOrderLine
        .setDb(db)
        .setApplication(mySqlApplication);
    container.setConnector(insertOrderLine as unknown as ICommonNode);
}

function initializeWooCommerce(cacheService: CacheService): void {
    const wooCommerceApplication = new WooCommerceApplication();
    container.setApplication(wooCommerceApplication);

    container.setNode(new WooCommerceCreateProductCategory(), wooCommerceApplication);
    container.setNode(new ERPToWooCommerceCategoryMapper());
    container.setNode(new GetProductCategoryCache(cacheService), wooCommerceApplication);
    container.setNode(new ERPToWooCommerceProductMapper());
    container.setNode(new FindProductBySkuCache(cacheService), wooCommerceApplication);
    container.setNode(new WooCommerceUpdateProduct(), wooCommerceApplication);
    container.setNode(new WooCommerceToERPOrderMapper());
    container.setNode(new WooCommerceGetOrders(), wooCommerceApplication);
}

export default function prepare(): void {
    // Load core services by:
    initiateContainer();

    const redisService = new Redis(redis.host);
    container.set(redisService);
    const curlService = container.get(CurlSender);
    const cacheService = new CacheService(redisService, curlService);
    container.set(cacheService);

    initializeERP();
    initializeWooCommerce(cacheService);
}
