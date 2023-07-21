import { createLoggerMockedServer, createMetricsMockedServer } from '@orchesty/nodejs-sdk/dist/test/MockServer';
import {closeConnections, dm, prepare, redis} from "../test/TestAbstract";

jest.setTimeout(10000);

beforeAll(async () => {
  createMetricsMockedServer();
  createLoggerMockedServer();
  await prepare();
})

beforeEach(async () => {
  await redis.dropAll();
  dm.getApplicationRepository().clearCache();
})

afterAll(async () => {
  await closeConnections();
})

jest.setTimeout(30000);
