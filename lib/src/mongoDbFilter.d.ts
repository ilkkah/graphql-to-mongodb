import { GraphQLFieldsType } from './common';
declare type GraphQLLeafOperators = 'EQ' | 'GT' | 'GTE' | 'IN' | 'ALL' | 'LT' | 'LTE' | 'NE' | 'NEQ' | 'NEQ' | 'NIN' | 'REGEX' | 'OPTIONS' | 'NOT';
declare type MongoDbLeafOperators = '$eq' | '$gt' | '$gte' | '$in' | '$all' | '$lt' | '$lte' | '$ne' | '$neq' | '$nin' | '$regex' | '$options' | '$not';
export declare type MongoDbRootOperators = '$or' | '$and' | '$nor';
export declare type GraphQLFilter = {
    [key: string]: GraphQLFilter[] | GraphQLObjectFilter | GraphQLLeafFilter;
    OR?: GraphQLFilter[];
    AND?: GraphQLFilter[];
    NOR?: GraphQLFilter[];
};
declare type GraphQLObjectFilter = {
    [key: string]: GraphQLObjectFilter | GraphQLLeafFilter | ('exists' | 'not_exists') | any[];
    opr?: 'exists' | 'not_exists';
};
declare type GraphQLLeafFilterInner = {
    [key in GraphQLLeafOperators]?: any | any[];
};
declare type GraphQLLeafFilter = GraphQLLeafFilterInner & {
    NOT?: GraphQLLeafFilterInner;
    opr?: 'exists' | 'not_exists';
    value?: any;
    values?: any[];
};
export declare type MongoDbFilter = {
    [key: string]: MongoDbLeafFilter | {
        $elemMatch: MongoDbObjectFilter;
    } | {
        $exists?: boolean;
    } | MongoDbFilter[];
    $or?: MongoDbFilter[];
    $and?: MongoDbFilter[];
    $nor?: MongoDbFilter[];
};
declare type MongoDbObjectFilter = {
    [key: string]: MongoDbLeafFilter | {
        $elemMatch: MongoDbObjectFilter;
    } | {
        $exists?: boolean;
    } | boolean;
};
declare type MongoDbLeafFilter = {
    [key in MongoDbLeafOperators]?: any | any[];
} & {
    $not?: MongoDbLeafFilter | RegExp;
};
export declare const getMongoDbFilter: (graphQLType: GraphQLFieldsType, graphQLFilter?: GraphQLFilter) => MongoDbFilter;
export {};
