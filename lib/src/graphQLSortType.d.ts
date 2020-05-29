import { GraphQLInputObjectType } from 'graphql';
import { GraphQLFieldsType } from './common';
export declare const FICTIVE_SORT = "_FICTIVE_SORT";
export declare const FICTIVE_SORT_DESCRIPTION = "IGNORE. Due to limitations of the package, objects with no sortable fields are not ommited. GraphQL input object types must have at least one field";
export declare function getGraphQLSortType(type: GraphQLFieldsType, ...excludedFields: string[]): GraphQLInputObjectType;
export declare const GraphQLSortType: any;
