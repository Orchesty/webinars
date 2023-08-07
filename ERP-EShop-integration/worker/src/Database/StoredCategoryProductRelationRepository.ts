import { AbstractRepository } from '@orchesty/nodejs-sdk/dist/lib/Storage/Mongo';
import { IndexDescription } from 'mongodb';
import StoredCategoryProductRelationEntity from './StoredCategoryProductRelationEntity';

export class StoredCategoryProductRelationRepository extends AbstractRepository<StoredCategoryProductRelationEntity> {

    protected readonly indices: IndexDescription[] = [
        {
            name: 'StoredCategoryProductRelation_categoryId',
            key: {
                categoryId: 1,
            },
        },
        {
            name: 'StoredCategoryProductRelation_productId',
            key: {
                productId: 1,
            },
        },
    ];

}
