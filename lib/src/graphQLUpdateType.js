"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGraphQLIncType = exports.getGraphQLSetType = exports.getGraphQLSetOnInsertType = exports.getGraphQLUpdateType = exports.FICTIVE_INC_DESCRIPTION = exports.FICTIVE_INC = exports.OVERWRITE_DESCRIPTION = exports.OVERWRITE = void 0;
var graphql_1 = require("graphql");
var common_1 = require("./common");
exports.OVERWRITE = "_OVERWRITE";
exports.OVERWRITE_DESCRIPTION = "If set to true, the object would be overwriten entirely, including fields that are not specified. Non-null validation rules will apply. Once set to true, any child object will overwriten invariably of the value set to this field.";
exports.FICTIVE_INC = "_FICTIVE_INC";
exports.FICTIVE_INC_DESCRIPTION = "IGNORE. Due to limitations of the package, objects with no incrementable fields cannot be ommited. All input object types must have at least one field";
function getGraphQLUpdateType(type) {
    var excludedFields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludedFields[_i - 1] = arguments[_i];
    }
    var updateTypeName = common_1.setSuffix(type.name, 'Type', 'UpdateType');
    return common_1.cache(common_1.typesCache, updateTypeName, function () { return new graphql_1.GraphQLInputObjectType({
        name: updateTypeName,
        fields: getUpdateFields.apply(void 0, __spreadArrays([type], excludedFields))
    }); });
}
exports.getGraphQLUpdateType = getGraphQLUpdateType;
function getUpdateFields(graphQLType) {
    var excludedFields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludedFields[_i - 1] = arguments[_i];
    }
    return function () { return ({
        setOnInsert: { type: getGraphQLSetOnInsertType.apply(void 0, __spreadArrays([graphQLType], excludedFields)) },
        set: { type: getGraphQLSetType.apply(void 0, __spreadArrays([graphQLType], excludedFields)) },
        inc: { type: getGraphQLIncType.apply(void 0, __spreadArrays([graphQLType], excludedFields)) }
    }); };
}
function getGraphQLSetOnInsertType(type) {
    var excludedFields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludedFields[_i - 1] = arguments[_i];
    }
    if (type instanceof graphql_1.GraphQLScalarType ||
        type instanceof graphql_1.GraphQLEnumType) {
        return type;
    }
    if (type instanceof graphql_1.GraphQLNonNull) {
        return getGraphQLSetOnInsertType(type.ofType);
    }
    if (type instanceof graphql_1.GraphQLList) {
        return new graphql_1.GraphQLList(getGraphQLSetOnInsertType(type.ofType));
    }
    var inputTypeName = common_1.setSuffix(type.name, 'Type', 'SetOnInsertType');
    return common_1.cache(common_1.typesCache, inputTypeName, function () { return new graphql_1.GraphQLInputObjectType({
        name: inputTypeName,
        fields: common_1.getUnresolvedFieldsTypes.apply(void 0, __spreadArrays([type, getGraphQLSetOnInsertType], excludedFields))
    }); });
}
exports.getGraphQLSetOnInsertType = getGraphQLSetOnInsertType;
function getGraphQLSetType(type) {
    var excludedFields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludedFields[_i - 1] = arguments[_i];
    }
    var inputTypeName = common_1.setSuffix(type.name, 'Type', 'SetType');
    return common_1.cache(common_1.typesCache, inputTypeName, function () { return new graphql_1.GraphQLInputObjectType({
        name: inputTypeName,
        fields: common_1.getUnresolvedFieldsTypes.apply(void 0, __spreadArrays([type, function (_) {
                var excluded = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    excluded[_i - 1] = arguments[_i];
                }
                return getGraphQLSetObjectType.apply(void 0, __spreadArrays([_, false], excluded));
            }], excludedFields))
    }); });
}
exports.getGraphQLSetType = getGraphQLSetType;
function getGraphQLSetObjectType(type, isInList) {
    var excludedFields = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        excludedFields[_i - 2] = arguments[_i];
    }
    if (type instanceof graphql_1.GraphQLScalarType ||
        type instanceof graphql_1.GraphQLEnumType) {
        return type;
    }
    if (type instanceof graphql_1.GraphQLNonNull) {
        return getGraphQLSetObjectType(type.ofType, isInList);
    }
    if (type instanceof graphql_1.GraphQLList) {
        return new graphql_1.GraphQLList(getGraphQLSetObjectType(type.ofType, true));
    }
    var inputTypeName = common_1.setSuffix(type.name, 'Type', isInList ? 'SetListObjectType' : 'SetObjectType');
    return common_1.cache(common_1.typesCache, inputTypeName, function () { return new graphql_1.GraphQLInputObjectType({
        name: inputTypeName,
        fields: getGraphQLSetObjectTypeFields.apply(void 0, __spreadArrays([type, isInList], excludedFields))
    }); });
}
function getGraphQLSetObjectTypeFields(type, isInList) {
    var excludedFields = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        excludedFields[_i - 2] = arguments[_i];
    }
    return function () {
        var fields = common_1.getUnresolvedFieldsTypes.apply(void 0, __spreadArrays([type, function (_) {
                var excluded = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    excluded[_i - 1] = arguments[_i];
                }
                return getGraphQLSetObjectType.apply(void 0, __spreadArrays([_, isInList], excluded));
            }], excludedFields))();
        if (!isInList) {
            fields[exports.OVERWRITE] = { type: graphql_1.GraphQLBoolean, description: exports.OVERWRITE_DESCRIPTION };
        }
        return fields;
    };
}
function getGraphQLIncType(type) {
    var excludedFields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludedFields[_i - 1] = arguments[_i];
    }
    if (type instanceof graphql_1.GraphQLScalarType ||
        type instanceof graphql_1.GraphQLEnumType) {
        if (["Int", "Float"].includes(type.name)) {
            return type;
        }
        return undefined;
    }
    if (type instanceof graphql_1.GraphQLNonNull) {
        return getGraphQLIncType(type.ofType);
    }
    if (type instanceof graphql_1.GraphQLList) {
        return undefined;
    }
    var inputTypeName = common_1.setSuffix(type.name, 'Type', 'IncType');
    return common_1.cache(common_1.typesCache, inputTypeName, function () { return new graphql_1.GraphQLInputObjectType({
        name: inputTypeName,
        fields: getGraphQLIncTypeFields.apply(void 0, __spreadArrays([type], excludedFields))
    }); });
}
exports.getGraphQLIncType = getGraphQLIncType;
function getGraphQLIncTypeFields(type) {
    var excludedFields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludedFields[_i - 1] = arguments[_i];
    }
    return function () {
        var _a;
        var fields = common_1.getUnresolvedFieldsTypes.apply(void 0, __spreadArrays([type, getGraphQLIncType], excludedFields))();
        if (Object.keys(fields).length > 0) {
            return fields;
        }
        return _a = {}, _a[exports.FICTIVE_INC] = { type: graphql_1.GraphQLInt, description: exports.FICTIVE_INC_DESCRIPTION }, _a;
    };
}
