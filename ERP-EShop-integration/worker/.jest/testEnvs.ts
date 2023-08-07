// --- COMMONS ---
process.env.APP_ENV = 'prod' // 'debug' <= use it if you want to see more logs
process.env.CRYPT_SECRET = 'ThisIsNotSoSecret';
process.env.ORCHESTY_API_KEY = 'ThisIsNotSoSecretApiKey';
process.env.BACKEND_URL = 'http://127.0.0.42:8080'
process.env.STARTING_POINT_URL = 'http://127.0.0.42:8080'
process.env.WORKER_API_HOST = 'http://127.0.0.42:8080'

if (process.env.JEST_DOCKER) {
    process.env.MYSQL_HOST = 'db';
    process.env.REDIS_DSN = 'redis://redis'
    process.env.MONGODB_DSN = `mongodb://mongo/webinars${process.env.JEST_WORKER_ID ?? 0}`;
} else {
    process.env.MYSQL_HOST = '127.0.0.42';
    process.env.REDIS_DSN = 'redis://127.0.0.42'
    process.env.MONGODB_DSN = `mongodb://127.0.0.42:27017/webinars${process.env.JEST_WORKER_ID ?? 0}`;
}
