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
exports.getGraphQLFilterType = void 0;
var graphql_1 = require("graphql");
var common_1 = require("./common");
var logger_1 = require("./logger");
var warnedIndependentResolvers = {};
var GetOprExistsType = function () { return (0, common_1.cache)(common_1.typesCache, "OprExists", function () { return new graphql_1.GraphQLEnumType({
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
    var filterTypeName = (0, common_1.setSuffix)(type.name, 'Type', 'FilterType');
    return (0, common_1.cache)(common_1.typesCache, filterTypeName, function () { return new graphql_1.GraphQLInputObjectType({
        name: filterTypeName,
        fields: getOrAndFields.apply(void 0, __spreadArray([type], excludedFields, false))
    }); });
}
exports.getGraphQLFilterType = getGraphQLFilterType;
function getOrAndFields(type) {
    var excludedFields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludedFields[_i - 1] = arguments[_i];
    }
    return function () {
        var generatedFields = common_1.getUnresolvedFieldsTypes.apply(void 0, __spreadArray([type, getGraphQLObjectFilterType], excludedFields, false))();
        warnOfIndependentResolveFields(type);
        generatedFields['OR'] = { type: new graphql_1.GraphQLList(getGraphQLFilterType.apply(void 0, __spreadArray([type], excludedFields, false))) };
        generatedFields['AND'] = { type: new graphql_1.GraphQLList(getGraphQLFilterType.apply(void 0, __spreadArray([type], excludedFields, false))) };
        generatedFields['NOR'] = { type: new graphql_1.GraphQLList(getGraphQLFilterType.apply(void 0, __spreadArray([type], excludedFields, false))) };
        return generatedFields;
    };
}
function getGraphQLObjectFilterType(type) {
    var excludedFields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludedFields[_i - 1] = arguments[_i];
    }
    if ((0, graphql_1.isLeafType)(type)) {
        return getGraphQLLeafFilterType(type);
    }
    if (type instanceof graphql_1.GraphQLUnionType) {
        var types = type.getTypes();
        var fields = {};
        types.forEach(function (t) {
            Object.assign(fields, getInputObjectTypeFields.apply(void 0, __spreadArray([t], excludedFields, false))());
        });
        var unionTypeName_1 = (0, common_1.setSuffix)(type.name, 'Type', 'ObjectFilterType');
        return (0, common_1.cache)(common_1.typesCache, unionTypeName_1, function () { return new graphql_1.GraphQLInputObjectType({
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
    var typeName = (0, common_1.setSuffix)(type.name, 'Type', 'ObjectFilterType');
    return (0, common_1.cache)(common_1.typesCache, typeName, function () { return new graphql_1.GraphQLInputObjectType({
        name: typeName,
        fields: getInputObjectTypeFields.apply(void 0, __spreadArray([type], excludedFields, false))
    }); });
}
function getInputObjectTypeFields(type) {
    var excludedFields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludedFields[_i - 1] = arguments[_i];
    }
    return function () {
        var generatedFields = common_1.getUnresolvedFieldsTypes.apply(void 0, __spreadArray([type, getGraphQLObjectFilterType], excludedFields, false))();
        warnOfIndependentResolveFields(type);
        generatedFields['opr'] = { type: GetOprExistsType() };
        return generatedFields;
    };
}
function getGraphQLLeafFilterType(leafType, not) {
    if (not === void 0) { not = false; }
    var typeName = leafType.toString() + (not ? "Not" : '') + "Filter";
    return (0, common_1.cache)(common_1.typesCache, typeName, function () { return new graphql_1.GraphQLInputObjectType({
        name: typeName,
        description: "Filter type for ".concat((not ? "$not of " : '')).concat(leafType, " scalar"),
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
    (0, common_1.cache)(warnedIndependentResolvers, type.toString(), function () {
        var fields = (0, common_1.getTypeFields)(type, function (key, field) {
            return field.resolve && (field.extensions.graphqlToMongoDb ? !Array.isArray(field.extensions.graphqlToMongoDb.dependencies) : true);
        })();
        Object.keys(fields).forEach(function (key) {
            return (0, logger_1.warn)("Field ".concat(key, " of type ").concat(type, " has a resolve function and no extensions.graphqlToMongoDb.dependencies"));
        });
        return 1;
    });
}
