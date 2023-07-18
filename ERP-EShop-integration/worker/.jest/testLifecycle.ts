import { createLoggerMockedServer, createMetricsMockedServer } from '@orchesty/nodejs-sdk/dist/test/MockServer';
import {closeConnections, dm, prepare} from "../test/TestAbstract";

jest.setTimeout(10000);

beforeAll(async () => {
  createMetricsMockedServer();
  createLoggerMockedServer();
  await prepare();
})

beforeEach(async () => {
  dm.getApplicationRepository().clearCache();
})

afterAll(async () => {
  await closeConnections();
})

jest.setTimeout(30000);
