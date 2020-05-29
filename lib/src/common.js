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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPrimitive = exports.addPrefixToProperties = exports.flatten = exports.isNonNullField = exports.isListField = exports.getInnerType = exports.getUnresolvedFieldsTypes = exports.getTypeFields = exports.setSuffix = exports.cache = exports.clearTypesCache = exports.getTypesCache = exports.typesCache = void 0;
var graphql_1 = require("graphql");
exports.typesCache = {};
exports.getTypesCache = function () { return (__assign({}, exports.typesCache)); };
function clearTypesCache() {
    Object.keys(exports.typesCache).forEach(function (_) { return delete exports.typesCache[_]; });
}
exports.clearTypesCache = clearTypesCache;
function cache(cacheObj, key, callback) {
    var item = cacheObj[key];
    if (item === undefined) {
        item = callback(key);
        cacheObj[key] = item;
    }
    return item;
}
exports.cache = cache;
function setSuffix(text, locate, replaceWith) {
    var regex = new RegExp(locate + "$");
    return regex.test(text)
        ? text.replace(regex, replaceWith)
        : "" + text + replaceWith;
}
exports.setSuffix = setSuffix;
function getTypeFields(graphQLType, filter, typeResolver) {
    if (filter === void 0) { filter = null; }
    if (typeResolver === void 0) { typeResolver = function (type) { return type; }; }
    var excludedFields = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        excludedFields[_i - 3] = arguments[_i];
    }
    return function () {
        var typeFields = graphQLType.getFields();
        var generatedFields = {};
        Object.keys(typeFields)
            .filter(function (key) { return !excludedFields.includes(key); })
            .filter(function (key) { return !filter || filter(key, typeFields[key]); })
            .forEach(function (key) {
            var field = typeFields[key];
            var type = typeResolver(field.type);
            if (type)
                generatedFields[key] = __assign(__assign({}, field), { type: type });
        }); //, ...excludedFields
        return generatedFields;
    };
}
exports.getTypeFields = getTypeFields;
function getUnresolvedFieldsTypes(graphQLType, typeResolver) {
    if (typeResolver === void 0) { typeResolver = null; }
    var excludedFields = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        excludedFields[_i - 2] = arguments[_i];
    }
    return function () {
        var fields = getTypeFields.apply(void 0, __spreadArrays([graphQLType, function (key, field) { return !field.resolve; }, typeResolver], excludedFields))();
        var fieldsTypes = {};
        Object.keys(fields).forEach(function (key) { return fieldsTypes[key] = { type: fields[key].type }; });
        return fieldsTypes;
    };
}
exports.getUnresolvedFieldsTypes = getUnresolvedFieldsTypes;
function getInnerType(graphQLType) {
    var innerType = graphQLType;
    while (innerType instanceof graphql_1.GraphQLList
        || innerType instanceof graphql_1.GraphQLNonNull) {
        innerType = innerType.ofType;
    }
    return innerType;
}
exports.getInnerType = getInnerType;
function isListField(graphQLType) {
    var innerType = graphQLType;
    while (innerType instanceof graphql_1.GraphQLList
        || innerType instanceof graphql_1.GraphQLNonNull) {
        if (innerType instanceof graphql_1.GraphQLList)
            return true;
        innerType = innerType.ofType;
    }
    return false;
}
exports.isListField = isListField;
function isNonNullField(graphQLType) {
    var innerType = graphQLType;
    while (innerType instanceof graphql_1.GraphQLList
        || innerType instanceof graphql_1.GraphQLNonNull) {
        if (innerType instanceof graphql_1.GraphQLNonNull)
            return true;
        innerType = innerType.ofType;
    }
    return false;
}
exports.isNonNullField = isNonNullField;
function flatten(nestedArray) {
    return nestedArray.reduce(function (agg, b) { return agg.concat(b); }, []);
}
exports.flatten = flatten;
function addPrefixToProperties(obj, prefix) {
    return Object.keys(obj).reduce(function (agg, key) {
        var _a;
        return (__assign(__assign({}, agg), (_a = {}, _a["" + prefix + key] = obj[key], _a)));
    }, {});
}
exports.addPrefixToProperties = addPrefixToProperties;
function isPrimitive(value) {
    var type = typeof value;
    return (type === "boolean"
        || type === "number"
        || type === "string"
        || type === "undefined"
        || (type === "object" && (value === null || isValidDate(value))));
}
exports.isPrimitive = isPrimitive;
function isValidDate(date) {
    return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
}
