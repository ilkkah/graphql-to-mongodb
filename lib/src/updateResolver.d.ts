import { MongoDbFilter } from './mongoDbFilter';
import { UpdateObj } from './mongoDbUpdate';
import { GraphQLNonNull, GraphQLResolveInfo, GraphQLFieldResolver, GraphQLObjectType, GraphQLInputObjectType } from 'graphql';
import { MongoDbProjection, GetMongoDbProjectionOptions } from './mongoDbProjection';
export interface UpdateCallback<TSource, TContext> {
    (filter: MongoDbFilter, update: UpdateObj, options: {
        upsert?: boolean;
    } | undefined, projection: MongoDbProjection | undefined, source: TSource, args: {
        [argName: string]: any;
    }, context: TContext, info: GraphQLResolveInfo): Promise<any>;
}
export declare type UpdateOptions = {
    differentOutputType?: boolean;
    validateUpdateArgs?: boolean;
    overwrite?: boolean;
} & Partial<GetMongoDbProjectionOptions>;
export declare function getMongoDbUpdateResolver<TSource, TContext>(graphQLType: GraphQLObjectType, updateCallback: UpdateCallback<TSource, TContext>, updateOptions?: UpdateOptions): GraphQLFieldResolver<TSource, TContext>;
export declare function getGraphQLUpdateArgs(graphQLType: GraphQLObjectType): {
    [key: string]: {
        type: GraphQLNonNull<GraphQLInputObjectType>;
    };
} & {
    filter: {
        type: GraphQLNonNull<GraphQLInputObjectType>;
    };
    update: {
        type: GraphQLNonNull<GraphQLInputObjectType>;
    };
};
