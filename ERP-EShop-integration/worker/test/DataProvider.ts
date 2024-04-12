import {
    NAME as Woocommerce,
    WOOCOMMERCE_URL,
} from '@orchesty/nodejs-connectors/dist/lib/WooCommerce/WooCommerceApplication';
import CoreFormsEnum from '@orchesty/nodejs-sdk/dist/lib/Application/Base/CoreFormsEnum';
import {
    IApplicationSettings,
} from '@orchesty/nodejs-sdk/dist/lib/Application/Database/ApplicationInstall';
import { PASSWORD, USER } from '@orchesty/nodejs-sdk/dist/lib/Authorization/Type/Basic/ABasicApplication';
import { orchestyOptions } from '@orchesty/nodejs-sdk/dist/lib/Config/Config';
import { HttpMethods } from '@orchesty/nodejs-sdk/dist/lib/Transport/HttpMethods';
import { appInstallConfig, mockOnce } from '@orchesty/nodejs-sdk/dist/test/MockServer';
import { MYSQL_NAME } from '../src/ERP/Batch/ListAllCategories';

export const DEFAULT_USER = 'TestUser';
export const DEFAULT_PASSWORD = 'Password';

export function appInstall(
    name: string,
    user: string,
    settings: IApplicationSettings,
    nonEncryptedSettings: IApplicationSettings = {},
    extraQueries: string[] = [],
    returnResponse = true,
): void {
    const response = {
        body: returnResponse ? [{
            ...appInstallConfig,
            user,
            key: name,
            settings,
            nonEncryptedSettings,
        }] : [],
    };

    mockOnce(
        [
            ...extraQueries,
            `filter={"users":["${user}"],"enabled":true,"names":["${name}"]}`,
            `filter={"users":["${user}"],"enabled":null,"names":["${name}"]}`,
        ].map((query) => ({
            request: {
                method: HttpMethods.GET,
                url: `${orchestyOptions.workerApi}/document/ApplicationInstall?${query}`,
            },
            response,
        })),
    );
}

export function mockMysql(nonEncryptedSettings = {}): void {
    appInstall(
        MYSQL_NAME,
        DEFAULT_USER,
        {
            [CoreFormsEnum.AUTHORIZATION_FORM]: {
                [USER]: 'root',
                [PASSWORD]: 'root',
                host: process.env.MYSQL_HOST,
                port: 3306,
                database: 'erp',
            },
        },
        nonEncryptedSettings,
    );
}

export function mockWooCommerce(): void {
    appInstall(
        Woocommerce,
        DEFAULT_USER,
        {
            [CoreFormsEnum.AUTHORIZATION_FORM]: {
                [USER]: 'TestUser',
                [PASSWORD]: DEFAULT_PASSWORD,
                [WOOCOMMERCE_URL]: 'http://woocommerce.com',
            },
        },
        {},
    );
}
