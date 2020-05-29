"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flattenListField = exports.validateNonNullableFieldsTraverse = exports.getShouldAssert = exports.validateNonNullListField = exports.validateNonNullableFieldsAssert = exports.validateNonNullableFields = exports.validateUpdateArgs = exports.ShouldAssert = void 0;
var graphql_1 = require("graphql");
var common_1 = require("./common");
var graphQLUpdateType_1 = require("./graphQLUpdateType");
var ShouldAssert;
(function (ShouldAssert) {
    ShouldAssert[ShouldAssert["DefaultTrueRoot"] = 0] = "DefaultTrueRoot";
    ShouldAssert[ShouldAssert["True"] = 1] = "True";
    ShouldAssert[ShouldAssert["False"] = 2] = "False";
})(ShouldAssert = exports.ShouldAssert || (exports.ShouldAssert = {}));
var defaultOptions = {
    overwrite: false,
};
function validateUpdateArgs(updateArgs, graphQLType, options) {
    if (options === void 0) { options = defaultOptions; }
    var errors = [];
    errors = errors.concat(validateNonNullableFieldsOuter(updateArgs, graphQLType, options));
    if (errors.length > 0) {
        throw new graphql_1.GraphQLError(errors.join("\n"));
    }
}
exports.validateUpdateArgs = validateUpdateArgs;
function validateNonNullableFieldsOuter(updateArgs, graphQLType, _a) {
    var overwrite = _a.overwrite, isResolvedField = _a.isResolvedField;
    var shouldAssert = !!updateArgs.setOnInsert
        ? ShouldAssert.True
        : overwrite
            ? ShouldAssert.DefaultTrueRoot
            : ShouldAssert.False;
    return validateNonNullableFields(Object.keys(updateArgs).map(function (_) { return updateArgs[_]; }), graphQLType, shouldAssert, isResolvedField);
}
function validateNonNullableFields(objects, graphQLType, shouldAssert, isResolvedField, path) {
    if (isResolvedField === void 0) { isResolvedField = function (field) { return !!field.resolve; }; }
    if (path === void 0) { path = []; }
    var typeFields = graphQLType.getFields();
    var errors = shouldAssert === ShouldAssert.True ? validateNonNullableFieldsAssert(objects, typeFields, path) : [];
    var overwrite = objects.map(function (_) { return _[graphQLUpdateType_1.OVERWRITE]; }).filter(function (_) { return _; })[0];
    shouldAssert = getShouldAssert(shouldAssert, overwrite);
    return __spreadArrays(errors, validateNonNullableFieldsTraverse(objects, typeFields, shouldAssert, isResolvedField, path));
}
exports.validateNonNullableFields = validateNonNullableFields;
function validateNonNullableFieldsAssert(objects, typeFields, path) {
    if (path === void 0) { path = []; }
    return Object
        .keys(typeFields)
        .map(function (key) { return ({ key: key, type: typeFields[key].type }); })
        .filter(function (field) { return common_1.isNonNullField(field.type) && (field.key !== '_id' || path.length > 0); })
        .reduce(function (agg, field) {
        var fieldPath = __spreadArrays(path, [field.key]).join(".");
        var fieldValues = objects.map(function (_) { return _[field.key]; }).filter(function (_) { return _ !== undefined; });
        if (field.type instanceof graphql_1.GraphQLNonNull) {
            if (fieldValues.some(function (_) { return _ === null; }))
                return __spreadArrays(agg, ["Non-nullable field \"" + fieldPath + "\" is set to null"]);
            if (fieldValues.length === 0)
                return __spreadArrays(agg, ["Missing non-nullable field \"" + fieldPath + "\""]);
        }
        if (common_1.isListField(field.type) && !validateNonNullListField(fieldValues, field.type)) {
            return __spreadArrays(agg, ["Non-nullable element of array \"" + fieldPath + "\" is set to null"]);
        }
        return agg;
    }, []);
}
exports.validateNonNullableFieldsAssert = validateNonNullableFieldsAssert;
function validateNonNullListField(fieldValues, type) {
    if (type instanceof graphql_1.GraphQLNonNull) {
        if (fieldValues.some(function (_) { return _ === null; })) {
            return false;
        }
        return validateNonNullListField(fieldValues, type.ofType);
    }
    if (type instanceof graphql_1.GraphQLList) {
        return validateNonNullListField(common_1.flatten(fieldValues.filter(function (_) { return _; })), type.ofType);
    }
    return true;
}
exports.validateNonNullListField = validateNonNullListField;
function getShouldAssert(current, input) {
    if (current === ShouldAssert.True) {
        return ShouldAssert.True;
    }
    if (typeof input !== "undefined") {
        return input ? ShouldAssert.True : ShouldAssert.False;
    }
    if (current === ShouldAssert.DefaultTrueRoot) {
        return ShouldAssert.True;
    }
    return current;
}
exports.getShouldAssert = getShouldAssert;
function validateNonNullableFieldsTraverse(objects, typeFields, shouldAssert, isResolvedField, path) {
    if (isResolvedField === void 0) { isResolvedField = function (field) { return !!field.resolve; }; }
    if (path === void 0) { path = []; }
    var keys = Array.from(new Set(common_1.flatten(objects.map(function (_) { return Object.keys(_); }))));
    return keys.reduce(function (agg, key) {
        var field = typeFields[key];
        var type = field.type;
        var innerType = common_1.getInnerType(type);
        if (!(innerType instanceof graphql_1.GraphQLObjectType) || isResolvedField(field)) {
            return agg;
        }
        var newPath = __spreadArrays(path, [key]);
        var values = objects.map(function (_) { return _[key]; }).filter(function (_) { return _; });
        if (common_1.isListField(type)) {
            return __spreadArrays(agg, common_1.flatten(flattenListField(values, type).map(function (_) { return validateNonNullableFields([_], innerType, ShouldAssert.True, isResolvedField, newPath); })));
        }
        else {
            return __spreadArrays(agg, validateNonNullableFields(values, innerType, shouldAssert, isResolvedField, newPath));
        }
    }, []);
}
exports.validateNonNullableFieldsTraverse = validateNonNullableFieldsTraverse;
function flattenListField(objects, type) {
    if (type instanceof graphql_1.GraphQLNonNull) {
        return flattenListField(objects, type.ofType);
    }
    if (type instanceof graphql_1.GraphQLList) {
        return flattenListField(common_1.flatten(objects).filter(function (_) { return _; }), type.ofType);
    }
    return objects;
}
exports.flattenListField = flattenListField;
