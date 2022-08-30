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
    var updateTypeName = (0, common_1.setSuffix)(type.name, 'Type', 'UpdateType');
    return (0, common_1.cache)(common_1.typesCache, updateTypeName, function () { return new graphql_1.GraphQLInputObjectType({
        name: updateTypeName,
        fields: getUpdateFields.apply(void 0, __spreadArray([type], excludedFields, false))
    }); });
}
exports.getGraphQLUpdateType = getGraphQLUpdateType;
function getUpdateFields(graphQLType) {
    var excludedFields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludedFields[_i - 1] = arguments[_i];
    }
    return function () { return ({
        setOnInsert: { type: getGraphQLSetOnInsertType.apply(void 0, __spreadArray([graphQLType], excludedFields, false)) },
        set: { type: getGraphQLSetType.apply(void 0, __spreadArray([graphQLType], excludedFields, false)) },
        inc: { type: getGraphQLIncType.apply(void 0, __spreadArray([graphQLType], excludedFields, false)) }
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
    var inputTypeName = (0, common_1.setSuffix)(type.name, 'Type', 'SetOnInsertType');
    return (0, common_1.cache)(common_1.typesCache, inputTypeName, function () { return new graphql_1.GraphQLInputObjectType({
        name: inputTypeName,
        fields: common_1.getUnresolvedFieldsTypes.apply(void 0, __spreadArray([type, getGraphQLSetOnInsertType], excludedFields, false))
    }); });
}
exports.getGraphQLSetOnInsertType = getGraphQLSetOnInsertType;
function getGraphQLSetType(type) {
    var excludedFields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludedFields[_i - 1] = arguments[_i];
    }
    var inputTypeName = (0, common_1.setSuffix)(type.name, 'Type', 'SetType');
    return (0, common_1.cache)(common_1.typesCache, inputTypeName, function () { return new graphql_1.GraphQLInputObjectType({
        name: inputTypeName,
        fields: common_1.getUnresolvedFieldsTypes.apply(void 0, __spreadArray([type, function (_) {
                var excluded = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    excluded[_i - 1] = arguments[_i];
                }
                return getGraphQLSetObjectType.apply(void 0, __spreadArray([_, false], excluded, false));
            }], excludedFields, false))
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
    var inputTypeName = (0, common_1.setSuffix)(type.name, 'Type', isInList ? 'SetListObjectType' : 'SetObjectType');
    return (0, common_1.cache)(common_1.typesCache, inputTypeName, function () { return new graphql_1.GraphQLInputObjectType({
        name: inputTypeName,
        fields: getGraphQLSetObjectTypeFields.apply(void 0, __spreadArray([type, isInList], excludedFields, false))
    }); });
}
function getGraphQLSetObjectTypeFields(type, isInList) {
    var excludedFields = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        excludedFields[_i - 2] = arguments[_i];
    }
    return function () {
        var fields = common_1.getUnresolvedFieldsTypes.apply(void 0, __spreadArray([type, function (_) {
                var excluded = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    excluded[_i - 1] = arguments[_i];
                }
                return getGraphQLSetObjectType.apply(void 0, __spreadArray([_, isInList], excluded, false));
            }], excludedFields, false))();
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
    var inputTypeName = (0, common_1.setSuffix)(type.name, 'Type', 'IncType');
    return (0, common_1.cache)(common_1.typesCache, inputTypeName, function () { return new graphql_1.GraphQLInputObjectType({
        name: inputTypeName,
        fields: getGraphQLIncTypeFields.apply(void 0, __spreadArray([type], excludedFields, false))
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
        var fields = common_1.getUnresolvedFieldsTypes.apply(void 0, __spreadArray([type, getGraphQLIncType], excludedFields, false))();
        if (Object.keys(fields).length > 0) {
            return fields;
        }
        return _a = {}, _a[exports.FICTIVE_INC] = { type: graphql_1.GraphQLInt, description: exports.FICTIVE_INC_DESCRIPTION }, _a;
    };
}
