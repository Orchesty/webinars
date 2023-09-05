import RunTopology from '@orchesty/nodejs-connectors/dist/lib/Common/RunTopology/RunTopology';
import MySqlApplication from '@orchesty/nodejs-connectors/dist/lib/Sql/MySqlApplication';
import WooCommerceGetOrders from '@orchesty/nodejs-connectors/dist/lib/WooCommerce/Batch/WooCommerceGetOrders';
import WooCommerceCreateProduct
    from '@orchesty/nodejs-connectors/dist/lib/WooCommerce/Connector/WooCommerceCreateProduct';
import { container, initiateContainer } from '@orchesty/nodejs-sdk';
import CacheService from '@orchesty/nodejs-sdk/dist/lib/Cache/CacheService';
import { ICommonNode } from '@orchesty/nodejs-sdk/dist/lib/Commons/ICommonNode';
import DatabaseClient from '@orchesty/nodejs-sdk/dist/lib/Storage/Database/Client';
import { MongoDb } from '@orchesty/nodejs-sdk/dist/lib/Storage/Mongo';
import Redis from '@orchesty/nodejs-sdk/dist/lib/Storage/Redis/Redis';
import TopologyRunner from '@orchesty/nodejs-sdk/dist/lib/Topology/TopologyRunner';
import CurlSender from '@orchesty/nodejs-sdk/dist/lib/Transport/Curl/CurlSender';
import RunProductsTopology from './Common/RunProductsTopology';
import { mongodb, redis } from './config/config';
import { StoredCategoryProductRelationRepository } from './Database/StoredCategoryProductRelationRepository';
import ListAllCategories from './ERP/Batch/ListAllCategories';
import ListAllProducts from './ERP/Batch/ListAllProducts';
import ListAllStocks from './ERP/Batch/ListAllStocks';
import CustomerExists from './ERP/Connector/CustomerExists';
import InsertCustomer from './ERP/Connector/InsertCustomer';
import InsertOrder from './ERP/Connector/InsertOrder';
import InsertOrderLine from './ERP/Connector/InsertOrderLine';
import OrderExists from './ERP/Connector/OrderExists';
import StoreRelation from './ERP/CustomNode/StoreRelation';
import WooCommerceToERPOrderMapper from './ERP/CustomNode/WooCommerceToERPOrderMapper';
import FindProductBySkuCacheSyncInventory from './WooCommerce/Connector/FindProductBySkuCacheSyncInventory';
import FindProductBySkuCacheSyncProducts from './WooCommerce/Connector/FindProductBySkuCacheSyncProducts';
import FindProductCategoryCacheSyncCategories from './WooCommerce/Connector/FindProductCategoryCacheSyncCategories';
import FindProductCategoryCacheSyncProducts from './WooCommerce/Connector/FindProductCategoryCacheSyncProducts';
import WooCommerceCreateProductCategory from './WooCommerce/Connector/WooCommerceCreateProductCategory';
import WooCommerceUpdateProduct from './WooCommerce/Connector/WooCommerceUpdateProduct';
import ERPToWooCommerceCategoryMapper from './WooCommerce/CustomNode/ERPToWooCommerceCategoryMapper';
import ERPToWooCommerceInventoryMapper from './WooCommerce/CustomNode/ERPToWooCommerceInventoryMapper';
import ERPToWooCommerceProductMapper from './WooCommerce/CustomNode/ERPToWooCommerceProductMapper';
import WooCommerceApplication from './WooCommerce/WooCommerceApplication';

function initializeERP(storedCategoryProductRelationRepository: StoredCategoryProductRelationRepository): void {
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

    const listAllProducts = new ListAllProducts();
    listAllProducts
        .setDb(db)
        .setApplication(mySqlApplication);
    container.setBatch(listAllProducts);

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

    container.setNode(new WooCommerceToERPOrderMapper());
    container.setNode(new StoreRelation(storedCategoryProductRelationRepository));
}

function initializeWooCommerce(
    cacheService: CacheService,
    storedCategoryProductRelationRepository: StoredCategoryProductRelationRepository,
): void {
    const wooCommerceApplication = new WooCommerceApplication();
    container.setApplication(wooCommerceApplication);

    const topologyRunner = container.get(TopologyRunner);
    container.setNode(new RunProductsTopology(storedCategoryProductRelationRepository, topologyRunner, 'product-synchronization', 'cron'));
    container.setNode(new RunTopology(topologyRunner, 'category-synchronization', 'cron'));
    container.setNode(new WooCommerceCreateProductCategory(), wooCommerceApplication);
    container.setNode(new ERPToWooCommerceCategoryMapper());
    container.setNode(new FindProductCategoryCacheSyncCategories(
        storedCategoryProductRelationRepository,
        cacheService,
    ), wooCommerceApplication);
    container.setNode(new FindProductCategoryCacheSyncProducts(cacheService), wooCommerceApplication);
    container.setNode(new ERPToWooCommerceInventoryMapper());
    container.setNode(new FindProductBySkuCacheSyncInventory(cacheService), wooCommerceApplication);
    container.setNode(new FindProductBySkuCacheSyncProducts(cacheService), wooCommerceApplication);
    container.setNode(new WooCommerceUpdateProduct(), wooCommerceApplication);
    container.setNode(new WooCommerceCreateProduct(), wooCommerceApplication);
    container.setNode(new WooCommerceGetOrders(), wooCommerceApplication);
    container.setNode(new ERPToWooCommerceProductMapper());
}

export default async function prepare(): Promise<void> {
    // Load core services by:
    initiateContainer();

    const redisService = new Redis(redis.host);
    container.set(redisService);
    const curlService = container.get(CurlSender);
    const cacheService = new CacheService(redisService, curlService);
    container.set(cacheService);
    const mongoDb = new MongoDb(mongodb.dsn);
    await mongoDb.connect();
    container.set(mongoDb);
    const repository = new StoredCategoryProductRelationRepository(mongoDb, 'StoredCategoryProductRelationEntity');
    container.set(repository);

    initializeERP(repository);
    initializeWooCommerce(cacheService, repository);
}
