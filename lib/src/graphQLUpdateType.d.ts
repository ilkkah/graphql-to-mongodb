import { GraphQLInputObjectType, GraphQLList, GraphQLEnumType, GraphQLNonNull, GraphQLScalarType, GraphQLObjectType, GraphQLInputType } from 'graphql';
export declare const OVERWRITE = "_OVERWRITE";
export declare const OVERWRITE_DESCRIPTION = "If set to true, the object would be overwriten entirely, including fields that are not specified. Non-null validation rules will apply. Once set to true, any child object will overwriten invariably of the value set to this field.";
export declare const FICTIVE_INC = "_FICTIVE_INC";
export declare const FICTIVE_INC_DESCRIPTION = "IGNORE. Due to limitations of the package, objects with no incrementable fields cannot be ommited. All input object types must have at least one field";
export declare function getGraphQLUpdateType(type: GraphQLObjectType, ...excludedFields: string[]): GraphQLInputObjectType;
export declare function getGraphQLSetOnInsertType(type: GraphQLScalarType | GraphQLEnumType | GraphQLNonNull<any> | GraphQLObjectType | GraphQLList<any>, ...excludedFields: string[]): GraphQLInputType;
export declare function getGraphQLSetType(type: GraphQLObjectType, ...excludedFields: string[]): GraphQLInputObjectType;
export declare function getGraphQLIncType(type: GraphQLScalarType | GraphQLEnumType | GraphQLNonNull<any> | GraphQLObjectType | GraphQLList<any>, ...excludedFields: string[]): GraphQLInputType;
