"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGraphQLInsertType = void 0;
var graphql_1 = require("graphql");
var common_1 = require("./common");
function getGraphQLInsertType(graphQLType) {
    var excludedFields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludedFields[_i - 1] = arguments[_i];
    }
    var inputTypeName = common_1.setSuffix(graphQLType.name, 'Type', 'InsertType');
    return common_1.cache(common_1.typesCache, inputTypeName, function () { return new graphql_1.GraphQLInputObjectType({
        name: inputTypeName,
        fields: getGraphQLInsertTypeFields.apply(void 0, __spreadArrays([graphQLType], excludedFields))
    }); });
}
exports.getGraphQLInsertType = getGraphQLInsertType;
function getGraphQLInsertTypeFields(graphQLType) {
    var excludedFields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludedFields[_i - 1] = arguments[_i];
    }
    return function () {
        var fields = common_1.getUnresolvedFieldsTypes.apply(void 0, __spreadArrays([graphQLType, getGraphQLInsertTypeNested], excludedFields))();
        var idField = fields['_id'];
        if (idField && idField.type instanceof graphql_1.GraphQLNonNull) {
            idField.type = idField.type.ofType;
        }
        return fields;
    };
}
function getGraphQLInsertTypeNested(type) {
    var excludedFields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludedFields[_i - 1] = arguments[_i];
    }
    if (type instanceof graphql_1.GraphQLScalarType ||
        type instanceof graphql_1.GraphQLEnumType) {
        return type;
    }
    if (type instanceof graphql_1.GraphQLNonNull) {
        return new graphql_1.GraphQLNonNull(getGraphQLInsertTypeNested(type.ofType));
    }
    if (type instanceof graphql_1.GraphQLList) {
        return new graphql_1.GraphQLList(getGraphQLInsertTypeNested(type.ofType));
    }
    var inputTypeName = common_1.setSuffix(type.name, 'Type', 'InsertType');
    return common_1.cache(common_1.typesCache, inputTypeName, function () { return new graphql_1.GraphQLInputObjectType({
        name: inputTypeName,
        fields: common_1.getUnresolvedFieldsTypes.apply(void 0, __spreadArrays([type, getGraphQLInsertTypeNested], excludedFields))
    }); });
}
