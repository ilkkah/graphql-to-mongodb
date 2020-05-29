import { MongoDbFilter } from './mongoDbFilter';
import { MongoDbProjection, GetMongoDbProjectionOptions } from './mongoDbProjection';
import { MongoDbSort } from "./mongoDbSort";
import { GraphQLResolveInfo, GraphQLFieldResolver, GraphQLInputObjectType } from 'graphql';
import { GraphQLFieldsType } from './common';
export interface QueryCallback<TSource, TContext> {
    (filter: MongoDbFilter, projection: MongoDbProjection, options: MongoDbOptions, source: TSource, args: {
        [argName: string]: any;
    }, context: TContext, info: GraphQLResolveInfo): Promise<any>;
}
export interface MongoDbOptions {
    sort?: MongoDbSort;
    limit?: number;
    skip?: number;
    projection?: MongoDbProjection;
}
export declare type QueryOptions = {
    differentOutputType?: boolean;
} & Partial<GetMongoDbProjectionOptions>;
export declare function getMongoDbQueryResolver<TSource, TContext>(graphQLType: GraphQLFieldsType, queryCallback: QueryCallback<TSource, TContext>, queryOptions?: QueryOptions): GraphQLFieldResolver<TSource, TContext>;
export declare function getGraphQLQueryArgs(graphQLType: GraphQLFieldsType): {
    [key: string]: {
        type: GraphQLInputObjectType;
    };
} & {
    filter: {
        type: GraphQLInputObjectType;
    };
    sort: {
        type: GraphQLInputObjectType;
    };
    pagination: {
        type: GraphQLInputObjectType;
    };
};
