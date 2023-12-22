import { readFileSync } from 'fs';
export const devIp = readFileSync( __dirname + '/../.env')?.toString()?.match("(DEV_IP=)(.*)")?.[2] ?? '';

// --- COMMONS ---
process.env.APP_ENV = 'prod' // 'debug' <= use it if you want to see more logs
process.env.CRYPT_SECRET = 'ThisIsNotSoSecret';
process.env.ORCHESTY_API_KEY = 'ThisIsNotSoSecretApiKey';
process.env.BACKEND_URL = `http://${devIp}:8080`
process.env.STARTING_POINT_URL = `http://${devIp}:8080`
process.env.WORKER_API_HOST = `http://${devIp}:8080`

if (process.env.JEST_DOCKER) {
    process.env.MYSQL_HOST = 'db';
    process.env.REDIS_DSN = 'redis://redis'
    process.env.MONGODB_DSN = `mongodb://mongo/webinars${process.env.JEST_WORKER_ID ?? 0}`;
} else {
    process.env.MYSQL_HOST = devIp;
    process.env.REDIS_DSN = `redis://${devIp}`
    process.env.MONGODB_DSN = `mongodb://${devIp}:27017/webinars${process.env.JEST_WORKER_ID ?? 0}`;
}
