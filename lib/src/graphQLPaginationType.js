"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var graphql_1 = require("graphql");
exports.default = new graphql_1.GraphQLInputObjectType({
    name: "PaginationType",
    fields: {
        limit: { type: graphql_1.GraphQLInt },
        skip: { type: graphql_1.GraphQLInt }
    }
});
