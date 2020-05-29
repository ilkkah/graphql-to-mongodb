"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMongoDbFilter = void 0;
var graphql_1 = require("graphql");
var common_1 = require("./common");
var logger_1 = require("./logger");
var operatorsMongoDbKeys = {
    EQ: '$eq',
    GT: '$gt',
    GTE: '$gte',
    IN: '$in',
    ALL: '$all',
    LT: '$lt',
    LTE: '$lte',
    NE: '$ne',
    NEQ: '$ne',
    NIN: '$nin',
    REGEX: '$regex',
    OPTIONS: '$options',
    NOT: '$not',
    OR: '$or',
    AND: '$and',
    NOR: '$nor',
};
var rootOperators = ['OR', 'AND', 'NOR'];
exports.getMongoDbFilter = logger_1.logOnError(function (graphQLType, graphQLFilter) {
    if (graphQLFilter === void 0) { graphQLFilter = {}; }
    if (!graphql_1.isType(graphQLType))
        throw 'First arg of getMongoDbFilter must be the base graphqlType to be parsed';
    var filter = parseMongoDbFilter.apply(void 0, __spreadArrays([graphQLType, graphQLFilter], rootOperators));
    rootOperators
        .map(function (key) { return ({ key: key, args: graphQLFilter[key] }); })
        .filter(function (_a) {
        var args = _a.args;
        return !!args && args.length > 0;
    })
        .forEach(function (_a) {
        var key = _a.key, args = _a.args;
        return filter[operatorsMongoDbKeys[key]] =
            args.map(function (_) { return exports.getMongoDbFilter(graphQLType, _); });
    });
    return filter;
});
function parseMongoDbFilter(type, graphQLFilter) {
    var excludedFields = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        excludedFields[_i - 2] = arguments[_i];
    }
    var typeFields = {};
    if (type instanceof graphql_1.GraphQLUnionType) {
        var types = type.getTypes();
        types.forEach(function (t) {
            Object.assign(typeFields, common_1.getTypeFields(t)());
        });
    }
    else {
        typeFields = common_1.getTypeFields(type)();
    }
    return Object.keys(graphQLFilter)
        .filter(function (key) { return !excludedFields.includes(key); })
        .reduce(function (agg, key) {
        var _a, _b, _c;
        if (key === 'opr') {
            return __assign(__assign({}, agg), parseMongoExistsFilter(graphQLFilter[key]));
        }
        var fieldFilter = graphQLFilter[key];
        var fieldType = common_1.getInnerType(typeFields[key].type);
        if (graphql_1.isLeafType(fieldType)) {
            var leafFilter = parseMongoDbLeafFilter(fieldFilter);
            if (Object.keys(leafFilter).length > 0) {
                if (key === 'id')
                    key = '_id';
                return __assign(__assign({}, agg), (_a = {}, _a[key] = leafFilter, _a));
            }
        }
        else {
            var nestedFilter = parseMongoDbFilter.apply(void 0, __spreadArrays([fieldType, fieldFilter], excludedFields));
            if (Object.keys(nestedFilter).length > 0) {
                if (common_1.isListField(typeFields[key].type)) {
                    return __assign(__assign({}, agg), (_b = {}, _b[key] = { '$elemMatch': nestedFilter }, _b));
                }
                else {
                    var $exists = nestedFilter.$exists, nestedObjectFilter = __rest(nestedFilter, ["$exists"]);
                    var exists = typeof $exists === 'boolean' ? (_c = {}, _c[key] = { $exists: $exists }, _c) : {};
                    return __assign(__assign(__assign({}, agg), common_1.addPrefixToProperties(nestedObjectFilter, key + ".")), exists);
                }
            }
        }
        return agg;
    }, {});
}
function parseMongoExistsFilter(exists) {
    return { $exists: exists === 'exists' ? true : false };
}
function parseMongoDbLeafFilter(graphQLLeafFilter, not) {
    if (not === void 0) { not = false; }
    var mongoDbScalarFilter = {};
    Object.keys(graphQLLeafFilter)
        .filter(function (key) { return key !== 'value' && key !== 'values' && key !== 'OPTIONS'; })
        .forEach(function (key) {
        if (key === 'opr') {
            Object.assign(mongoDbScalarFilter, parseMongoExistsFilter(graphQLLeafFilter[key]));
            return;
        }
        if (key === 'NOT') {
            mongoDbScalarFilter[operatorsMongoDbKeys[key]] = parseMongoDbLeafNoteFilter(graphQLLeafFilter[key]);
            return;
        }
        var element = graphQLLeafFilter[key];
        mongoDbScalarFilter[operatorsMongoDbKeys[key]] = element;
        if (key === 'REGEX') {
            var options = graphQLLeafFilter['OPTIONS'];
            if (not) {
                mongoDbScalarFilter[operatorsMongoDbKeys[key]] = new RegExp(element, "g" + (options || ''));
            }
            else if (!!options) {
                mongoDbScalarFilter[operatorsMongoDbKeys['OPTIONS']] = graphQLLeafFilter['OPTIONS'];
            }
        }
    });
    return mongoDbScalarFilter;
}
function parseMongoDbLeafNoteFilter(graphQLLeafFilterInner) {
    if (!graphQLLeafFilterInner.REGEX) {
        return parseMongoDbLeafFilter(graphQLLeafFilterInner, true);
    }
    if (Object.keys(graphQLLeafFilterInner).length > (!!graphQLLeafFilterInner.OPTIONS ? 2 : 1)) {
        throw "NOT operator can contain either REGEX [and OPTIONS], or every other operator.";
    }
    return new RegExp(graphQLLeafFilterInner.REGEX, "g" + (graphQLLeafFilterInner.OPTIONS || ''));
}
