import { getEnv } from '@orchesty/nodejs-sdk/dist/lib/Config/Config';

export const redis = {
    host: getEnv('REDIS_DSN'),
};

export const mongodb = {
    dsn: getEnv('MONGODB_DSN'),
};
