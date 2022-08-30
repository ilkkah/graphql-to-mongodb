"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
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
    var inputTypeName = (0, common_1.setSuffix)(graphQLType.name, 'Type', 'InsertType');
    return (0, common_1.cache)(common_1.typesCache, inputTypeName, function () { return new graphql_1.GraphQLInputObjectType({
        name: inputTypeName,
        fields: getGraphQLInsertTypeFields.apply(void 0, __spreadArray([graphQLType], excludedFields, false))
    }); });
}
exports.getGraphQLInsertType = getGraphQLInsertType;
function getGraphQLInsertTypeFields(graphQLType) {
    var excludedFields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludedFields[_i - 1] = arguments[_i];
    }
    return function () {
        var fields = common_1.getUnresolvedFieldsTypes.apply(void 0, __spreadArray([graphQLType, getGraphQLInsertTypeNested], excludedFields, false))();
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
    var inputTypeName = (0, common_1.setSuffix)(type.name, 'Type', 'InsertType');
    return (0, common_1.cache)(common_1.typesCache, inputTypeName, function () { return new graphql_1.GraphQLInputObjectType({
        name: inputTypeName,
        fields: common_1.getUnresolvedFieldsTypes.apply(void 0, __spreadArray([type, getGraphQLInsertTypeNested], excludedFields, false))
    }); });
}
