import { GraphQLFieldsType } from './common';
import { GraphQLResolveInfo, GraphQLField } from 'graphql';
export interface MongoDbProjection {
    [key: string]: 1;
}
export interface GetMongoDbProjectionOptions {
    isResolvedField: (field: GraphQLField<any, any>) => boolean;
    excludedFields: string[];
}
export declare const getMongoDbProjection: (info: GraphQLResolveInfo, graphQLFieldsType: GraphQLFieldsType, options?: GetMongoDbProjectionOptions) => MongoDbProjection;
