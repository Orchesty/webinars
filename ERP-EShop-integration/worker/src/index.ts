import { initiateContainer, listen } from '@orchesty/nodejs-sdk';

function prepare(): void {
    // Load core services by:
    initiateContainer();
}

// Start App by:
prepare();
listen();
