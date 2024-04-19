import { listen } from '@orchesty/nodejs-sdk';
import logger from '@orchesty/nodejs-sdk/dist/lib/Logger/Logger';
import prepare from './index';

// Start App by:
prepare()
    .then(listen)
    .catch((e: unknown) => {
        logger.error((e as { message?: string })?.message ?? '', {});
        process.exit(1);
    });
