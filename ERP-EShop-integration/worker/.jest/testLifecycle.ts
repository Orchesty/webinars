import { createLoggerMockedServer, createMetricsMockedServer } from '@orchesty/nodejs-sdk/dist/test/MockServer';
import {closeConnections, container, dm, prepare, redis} from "../test/TestAbstract";
import {StoredCategoryProductRelationRepository} from "../src/Database/StoredCategoryProductRelationRepository";

jest.setTimeout(10000);

beforeAll(async () => {
  createMetricsMockedServer();
  createLoggerMockedServer();
  await prepare();
})

beforeEach(async () => {
  await redis.dropAll();
  dm.getApplicationRepository().clearCache();
  await container.get(StoredCategoryProductRelationRepository).deleteAll();
})

afterAll(async () => {
  await closeConnections();
})

jest.setTimeout(30000);
