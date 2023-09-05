import { container as c } from '@orchesty/nodejs-sdk';
import DIContainer from '@orchesty/nodejs-sdk/dist/lib/DIContainer/Container';
import ADocument, { ClassType } from '@orchesty/nodejs-sdk/dist/lib/Storage/Database/ADocument';
import DatabaseClient from '@orchesty/nodejs-sdk/dist/lib/Storage/Database/Client';
import { MongoDb } from '@orchesty/nodejs-sdk/dist/lib/Storage/Mongo';
import Redis from '@orchesty/nodejs-sdk/dist/lib/Storage/Redis/Redis';
import CurlSender from '@orchesty/nodejs-sdk/dist/lib/Transport/Curl/CurlSender';
import p from '../src';

/* eslint-disable import/no-mutable-exports */
export let container: DIContainer;
export let dm: DatabaseClient;
export let db: MongoDb;
export let sender: CurlSender;
export let redis: Redis;

/* eslint-enable import/no-mutable-exports */

export async function prepare(): Promise<void> {
    await p();
    container = c;
    dm = c.get(DatabaseClient);
    db = c.get(MongoDb);
    sender = c.get(CurlSender);
    redis = c.get(Redis);
}

export async function dropCollection<T extends ADocument>(collection: ClassType<T>): Promise<void> {
    const repo = dm.getRepository(collection);

    try {
        await repo.removeMany({});
        await redis.dropAll();
    } catch {
        // ignore
    }
}

export async function closeConnections(): Promise<void> {
    await redis.close();
    await db.disconnect();
}
