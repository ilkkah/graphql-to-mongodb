import { GraphQLInputObjectType, GraphQLObjectType } from 'graphql';
export declare function getGraphQLInsertType(graphQLType: GraphQLObjectType, ...excludedFields: string[]): GraphQLInputObjectType;
