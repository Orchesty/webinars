import WooCommerceBaseApp, {
    WOOCOMMERCE_URL,
} from '@orchesty/nodejs-connectors/dist/lib/WooCommerce/WooCommerceApplication';
import CoreFormsEnum from '@orchesty/nodejs-sdk/dist/lib/Application/Base/CoreFormsEnum';
import Field from '@orchesty/nodejs-sdk/dist/lib/Application/Model/Form/Field';
import FieldType from '@orchesty/nodejs-sdk/dist/lib/Application/Model/Form/FieldType';
import Form from '@orchesty/nodejs-sdk/dist/lib/Application/Model/Form/Form';
import FormStack from '@orchesty/nodejs-sdk/dist/lib/Application/Model/Form/FormStack';
import { PASSWORD, USER } from '@orchesty/nodejs-sdk/dist/lib/Authorization/Type/Basic/ABasicApplication';

export default class WooCommerceApplication extends WooCommerceBaseApp {

    public getFormStack(): FormStack {
        const form = new Form(CoreFormsEnum.AUTHORIZATION_FORM, 'Authorization settings');
        form
            .addField(new Field(FieldType.TEXT, USER, 'User', undefined, true))
            .addField(new Field(FieldType.TEXT, PASSWORD, 'Password', undefined, true))
            .addField(new Field(FieldType.TEXT, WOOCOMMERCE_URL, 'Url', undefined, true));

        return new FormStack()
            .addForm(form);
    }

}
