import { UpdateArgs } from "./mongoDbUpdate";
import { GraphQLObjectType, GraphQLType, GraphQLFieldMap, GraphQLField } from "graphql";
export interface UpdateField {
    [key: string]: UpdateField | UpdateField[] | 1;
}
export declare enum ShouldAssert {
    DefaultTrueRoot = 0,
    True = 1,
    False = 2
}
export interface ValidateUpdateArgsOptions {
    overwrite: boolean;
    isResolvedField?: (field: GraphQLField<any, any>) => boolean;
}
export declare function validateUpdateArgs(updateArgs: UpdateArgs, graphQLType: GraphQLObjectType, options?: ValidateUpdateArgsOptions): void;
export declare function validateNonNullableFields(objects: object[], graphQLType: GraphQLObjectType, shouldAssert: ShouldAssert, isResolvedField?: ((field: GraphQLField<any, any>) => boolean), path?: string[]): string[];
export declare function validateNonNullableFieldsAssert(objects: object[], typeFields: GraphQLFieldMap<any, any>, path?: string[]): string[];
export declare function validateNonNullListField(fieldValues: object[], type: GraphQLType): boolean;
export declare function getShouldAssert(current: ShouldAssert, input?: boolean): ShouldAssert;
export declare function validateNonNullableFieldsTraverse(objects: object[], typeFields: GraphQLFieldMap<any, any>, shouldAssert: ShouldAssert, isResolvedField?: (field: GraphQLField<any, any>) => boolean, path?: string[]): string[];
export declare function flattenListField(objects: object[], type: GraphQLType): object[];
