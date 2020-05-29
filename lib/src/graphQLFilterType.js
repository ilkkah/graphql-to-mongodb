"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGraphQLFilterType = void 0;
var graphql_1 = require("graphql");
var common_1 = require("./common");
var logger_1 = require("./logger");
var warnedIndependentResolvers = {};
var GetOprExistsType = function () { return common_1.cache(common_1.typesCache, "OprExists", function () { return new graphql_1.GraphQLEnumType({
    name: 'OprExists',
    values: {
        EXISTS: { value: "exists" },
        NOT_EXISTS: { value: "not_exists" },
    }
}); }); };
function getGraphQLFilterType(type) {
    var excludedFields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludedFields[_i - 1] = arguments[_i];
    }
    var filterTypeName = common_1.setSuffix(type.name, 'Type', 'FilterType');
    return common_1.cache(common_1.typesCache, filterTypeName, function () { return new graphql_1.GraphQLInputObjectType({
        name: filterTypeName,
        fields: getOrAndFields.apply(void 0, __spreadArrays([type], excludedFields))
    }); });
}
exports.getGraphQLFilterType = getGraphQLFilterType;
function getOrAndFields(type) {
    var excludedFields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludedFields[_i - 1] = arguments[_i];
    }
    return function () {
        var generatedFields = common_1.getUnresolvedFieldsTypes.apply(void 0, __spreadArrays([type, getGraphQLObjectFilterType], excludedFields))();
        warnOfIndependentResolveFields(type);
        generatedFields['OR'] = { type: new graphql_1.GraphQLList(getGraphQLFilterType.apply(void 0, __spreadArrays([type], excludedFields))) };
        generatedFields['AND'] = { type: new graphql_1.GraphQLList(getGraphQLFilterType.apply(void 0, __spreadArrays([type], excludedFields))) };
        generatedFields['NOR'] = { type: new graphql_1.GraphQLList(getGraphQLFilterType.apply(void 0, __spreadArrays([type], excludedFields))) };
        return generatedFields;
    };
}
function getGraphQLObjectFilterType(type) {
    var excludedFields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludedFields[_i - 1] = arguments[_i];
    }
    if (graphql_1.isLeafType(type)) {
        return getGraphQLLeafFilterType(type);
    }
    if (type instanceof graphql_1.GraphQLUnionType) {
        var types = type.getTypes();
        var fields = {};
        types.forEach(function (t) {
            Object.assign(fields, getInputObjectTypeFields.apply(void 0, __spreadArrays([t], excludedFields))());
        });
        var unionTypeName_1 = common_1.setSuffix(type.name, 'Type', 'ObjectFilterType');
        return common_1.cache(common_1.typesCache, unionTypeName_1, function () { return new graphql_1.GraphQLInputObjectType({
            name: unionTypeName_1,
            fields: function () { return fields; }
        }); });
    }
    if (type instanceof graphql_1.GraphQLNonNull) {
        return getGraphQLObjectFilterType(type.ofType);
    }
    if (type instanceof graphql_1.GraphQLList) {
        return getGraphQLObjectFilterType(type.ofType);
    }
    var typeName = common_1.setSuffix(type.name, 'Type', 'ObjectFilterType');
    return common_1.cache(common_1.typesCache, typeName, function () { return new graphql_1.GraphQLInputObjectType({
        name: typeName,
        fields: getInputObjectTypeFields.apply(void 0, __spreadArrays([type], excludedFields))
    }); });
}
function getInputObjectTypeFields(type) {
    var excludedFields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludedFields[_i - 1] = arguments[_i];
    }
    return function () {
        var generatedFields = common_1.getUnresolvedFieldsTypes.apply(void 0, __spreadArrays([type, getGraphQLObjectFilterType], excludedFields))();
        warnOfIndependentResolveFields(type);
        generatedFields['opr'] = { type: GetOprExistsType() };
        return generatedFields;
    };
}
function getGraphQLLeafFilterType(leafType, not) {
    if (not === void 0) { not = false; }
    var typeName = leafType.toString() + (not ? "Not" : '') + "Filter";
    return common_1.cache(common_1.typesCache, typeName, function () { return new graphql_1.GraphQLInputObjectType({
        name: typeName,
        description: "Filter type for " + (not ? "$not of " : '') + leafType + " scalar",
        fields: getGraphQLScalarFilterTypeFields(leafType, not)
    }); });
}
function getGraphQLScalarFilterTypeFields(scalarType, not) {
    var fields = {
        EQ: { type: scalarType, description: '$eq' },
        GT: { type: scalarType, description: '$gt' },
        GTE: { type: scalarType, description: '$gte' },
        IN: { type: new graphql_1.GraphQLList(scalarType), description: '$in' },
        ALL: { type: new graphql_1.GraphQLList(scalarType), description: '$all' },
        LT: { type: scalarType, description: '$lt' },
        LTE: { type: scalarType, description: '$lte' },
        NE: { type: scalarType, description: '$ne' },
        NIN: { type: new graphql_1.GraphQLList(scalarType), description: '$nin' },
        opr: { type: GetOprExistsType() }
    };
    if (scalarType.name === 'String') {
        enhanceWithRegexFields(fields);
    }
    if (!not)
        enhanceWithNotField(fields, scalarType);
    return fields;
}
function enhanceWithRegexFields(fields) {
    fields.REGEX = { type: graphql_1.GraphQLString, description: '$regex' };
    fields.OPTIONS = { type: graphql_1.GraphQLString, description: '$options. Modifiers for the $regex expression. Field is ignored on its own' };
}
function enhanceWithNotField(fields, scalarType) {
    fields.NOT = { type: getGraphQLLeafFilterType(scalarType, true), description: '$not' };
}
function warnOfIndependentResolveFields(type) {
    common_1.cache(warnedIndependentResolvers, type.toString(), function () {
        var fields = common_1.getTypeFields(type, function (key, field) {
            return field.resolve && !Array.isArray(field.dependencies);
        })();
        Object.keys(fields).forEach(function (key) {
            return logger_1.warn("Field " + key + " of type " + type + " has a resolve function and no dependencies");
        });
        return 1;
    });
}
