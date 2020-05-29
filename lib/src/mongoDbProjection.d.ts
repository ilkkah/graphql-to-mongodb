import { GraphQLFieldsType } from './common';
import { GraphQLField } from 'graphql';
export interface MongoDbProjection {
    [key: string]: 1;
}
export interface GetMongoDbProjectionOptions {
    isResolvedField: (field: GraphQLField<any, any>) => boolean;
    excludedFields: string[];
}
export declare const getMongoDbProjection: (info: any, graphQLFieldsType: GraphQLFieldsType, options?: GetMongoDbProjectionOptions) => MongoDbProjection;
