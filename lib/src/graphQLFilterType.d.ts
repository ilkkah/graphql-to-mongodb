import { GraphQLInputObjectType } from 'graphql';
import { GraphQLFieldsType } from './common';
export declare function getGraphQLFilterType(type: GraphQLFieldsType, ...excludedFields: string[]): GraphQLInputObjectType;
