import { GraphQLType, GraphQLObjectType, GraphQLArgument, GraphQLFieldResolver, FieldDefinitionNode, GraphQLNamedType, GraphQLInterfaceType } from 'graphql';
export interface cacheCallback<T> {
    (key: any): T;
}
export declare const typesCache: {
    [key: string]: GraphQLNamedType;
};
export declare const getTypesCache: () => {
    [key: string]: GraphQLNamedType;
};
export declare function clearTypesCache(): void;
export declare function cache<T>(cacheObj: object, key: any, callback: cacheCallback<T>): T;
export declare function setSuffix(text: string, locate: string, replaceWith: string): string;
export interface FieldFilter {
    (name: string, field: {
        resolve?: Function;
        dependencies?: string[];
    }): Boolean;
}
export interface TypeResolver<T extends GraphQLType> {
    (graphQLType: GraphQLType): T;
}
export interface FieldMap<T extends GraphQLType> {
    [key: string]: Field<T, any, any> & {
        type: T;
    };
}
export interface Field<TType extends GraphQLType, TSource, TContext, TArgs = {
    [argName: string]: any;
}> {
    name?: string;
    description?: string;
    type: TType;
    args?: GraphQLArgument[];
    resolve?: GraphQLFieldResolver<TSource, TContext, TArgs>;
    subscribe?: GraphQLFieldResolver<TSource, TContext, TArgs>;
    isDeprecated?: boolean;
    deprecationReason?: string;
    astNode?: FieldDefinitionNode;
    dependencies?: string[];
}
export declare type GraphQLFieldsType = GraphQLObjectType | GraphQLInterfaceType;
export declare function getTypeFields<T extends GraphQLType>(graphQLType: GraphQLFieldsType, filter?: FieldFilter, typeResolver?: TypeResolver<T>, ...excludedFields: string[]): () => FieldMap<T>;
export declare function getUnresolvedFieldsTypes<T extends GraphQLType>(graphQLType: GraphQLFieldsType, typeResolver?: TypeResolver<T>, ...excludedFields: string[]): () => FieldMap<T>;
export declare function getInnerType(graphQLType: GraphQLType): GraphQLType;
export declare function isListField(graphQLType: GraphQLType): boolean;
export declare function isNonNullField(graphQLType: GraphQLType): boolean;
export declare function flatten<T>(nestedArray: T[][]): T[];
export declare function addPrefixToProperties<T extends {}>(obj: T, prefix: string): T;
export declare function isPrimitive(value: any): boolean;
