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
    if ((0, graphql_1.isLeafType)(type)) {
        return exports.GraphQLSortType;
    }
    if (type instanceof graphql_1.GraphQLUnionType) {
        var types = type.getTypes();
        var fields = {};
        types.forEach(function (t) {
            Object.assign(fields, getGraphQLSortTypeFields.apply(void 0, __spreadArray([t], excludedFields, false))());
        });
        var unionSortTypeName_1 = (0, common_1.setSuffix)(type.name, 'Type', 'SortType');
        return (0, common_1.cache)(common_1.typesCache, unionSortTypeName_1, function () { return new graphql_1.GraphQLInputObjectType({
            name: unionSortTypeName_1,
            fields: function () { return fields; }
        }); });
    }
    if (type instanceof graphql_1.GraphQLNonNull) {
        return getGraphQLSortTypeObject(type.ofType);
    }
    if (type instanceof graphql_1.GraphQLObjectType ||
        type instanceof graphql_1.GraphQLInterfaceType) {
        return getGraphQLSortType.apply(void 0, __spreadArray([type], excludedFields, false));
    }
    return undefined;
}
function getGraphQLSortType(type) {
    var excludedFields = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        excludedFields[_i - 1] = arguments[_i];
    }
    var sortTypeName = (0, common_1.setSuffix)(type.name, 'Type', 'SortType');
    return (0, common_1.cache)(common_1.typesCache, sortTypeName, function () { return new graphql_1.GraphQLInputObjectType({
        name: sortTypeName,
        fields: getGraphQLSortTypeFields.apply(void 0, __spreadArray([type], excludedFields, false))
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
        var fields = common_1.getUnresolvedFieldsTypes.apply(void 0, __spreadArray([type, getGraphQLSortTypeObject], excludedFields, false))();
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
