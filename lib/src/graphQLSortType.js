"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphQLSortType = exports.getGraphQLSortType = exports.FICTIVE_SORT_DESCRIPTION = exports.FICTIVE_SORT = void 0;
var graphql_1 = require("graphql");
var common_1 = require("./common");
exports.FICTIVE_SORT = "_FICTIVE_SORT";
exports.FICTIVE_SORT_DESCRIPTION = "IGNORE. Due to limitations of the package, objects with no sortable fields are not ommited. GraphQL input object types must have at least one field";
function getGraphQLSortTypeObject(type) {
    var excludedFields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludedFields[_i - 1] = arguments[_i];
    }
    if (graphql_1.isLeafType(type)) {
        return exports.GraphQLSortType;
    }
    if (type instanceof graphql_1.GraphQLUnionType) {
        var types = type.getTypes();
        var fields = {};
        types.forEach(function (t) {
            Object.assign(fields, getGraphQLSortTypeFields.apply(void 0, __spreadArrays([t], excludedFields))());
        });
        var unionSortTypeName_1 = common_1.setSuffix(type.name, 'Type', 'SortType');
        return common_1.cache(common_1.typesCache, unionSortTypeName_1, function () { return new graphql_1.GraphQLInputObjectType({
            name: unionSortTypeName_1,
            fields: function () { return fields; }
        }); });
    }
    if (type instanceof graphql_1.GraphQLNonNull) {
        return getGraphQLSortTypeObject(type.ofType);
    }
    if (type instanceof graphql_1.GraphQLObjectType ||
        type instanceof graphql_1.GraphQLInterfaceType) {
        return getGraphQLSortType.apply(void 0, __spreadArrays([type], excludedFields));
    }
    return undefined;
}
function getGraphQLSortType(type) {
    var excludedFields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludedFields[_i - 1] = arguments[_i];
    }
    var sortTypeName = common_1.setSuffix(type.name, 'Type', 'SortType');
    return common_1.cache(common_1.typesCache, sortTypeName, function () { return new graphql_1.GraphQLInputObjectType({
        name: sortTypeName,
        fields: getGraphQLSortTypeFields.apply(void 0, __spreadArrays([type], excludedFields))
    }); });
}
exports.getGraphQLSortType = getGraphQLSortType;
function getGraphQLSortTypeFields(type) {
    var excludedFields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludedFields[_i - 1] = arguments[_i];
    }
    return function () {
        var _a;
        var fields = common_1.getUnresolvedFieldsTypes.apply(void 0, __spreadArrays([type, getGraphQLSortTypeObject], excludedFields))();
        if (Object.keys(fields).length > 0) {
            return fields;
        }
        return _a = {}, _a[exports.FICTIVE_SORT] = { type: exports.GraphQLSortType, isDeprecated: true, description: exports.FICTIVE_SORT_DESCRIPTION }, _a;
    };
}
exports.GraphQLSortType = new graphql_1.GraphQLEnumType({
    name: 'SortType',
    values: {
        ASC: { value: 1 },
        DESC: { value: -1 }
    }
});
