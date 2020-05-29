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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMongoDbInc = exports.getOverwrite = exports.getMongoDbSet = exports.getMongoDbUpdate = exports.SetOverwrite = void 0;
var common_1 = require("./common");
var logger_1 = require("./logger");
var graphQLUpdateType_1 = require("./graphQLUpdateType");
var SetOverwrite;
(function (SetOverwrite) {
    SetOverwrite[SetOverwrite["DefaultTrueRoot"] = 0] = "DefaultTrueRoot";
    SetOverwrite[SetOverwrite["True"] = 1] = "True";
    SetOverwrite[SetOverwrite["False"] = 2] = "False";
})(SetOverwrite = exports.SetOverwrite || (exports.SetOverwrite = {}));
exports.getMongoDbUpdate = logger_1.logOnError(function (update, overwrite) {
    if (overwrite === void 0) { overwrite = false; }
    var updateParams = {
        update: {}
    };
    if (update.setOnInsert) {
        updateParams.update.$setOnInsert = update.setOnInsert;
        updateParams.options = { upsert: true };
    }
    if (update.set) {
        updateParams.update.$set = getMongoDbSet(update.set, overwrite ? SetOverwrite.DefaultTrueRoot : SetOverwrite.False);
    }
    if (update.inc) {
        updateParams.update.$inc = getMongoDbInc(update.inc);
    }
    return updateParams;
});
function getMongoDbSet(set, setOverwrite) {
    return Object.keys(set).filter(function (_) { return _ !== graphQLUpdateType_1.OVERWRITE; }).reduce(function (agg, key) {
        var _a, _b, _c;
        var value = set[key];
        if (common_1.isPrimitive(value)) {
            if (value === undefined)
                return agg;
            return __assign(__assign({}, agg), (_a = {}, _a[key] = value, _a));
        }
        if (Array.isArray(value)) {
            return __assign(__assign({}, agg), (_b = {}, _b[key] = value, _b));
        }
        var childOverwrite = getOverwrite(setOverwrite, value[graphQLUpdateType_1.OVERWRITE]);
        var child = getMongoDbSet(value, childOverwrite);
        if (childOverwrite === SetOverwrite.False) {
            return __assign(__assign({}, agg), common_1.addPrefixToProperties(child, key + "."));
        }
        return __assign(__assign({}, agg), (_c = {}, _c[key] = child, _c));
    }, {});
}
exports.getMongoDbSet = getMongoDbSet;
function getOverwrite(current, input) {
    if (current === SetOverwrite.True) {
        return SetOverwrite.True;
    }
    if (typeof input !== "undefined") {
        return input ? SetOverwrite.True : SetOverwrite.False;
    }
    if (current === SetOverwrite.DefaultTrueRoot) {
        return SetOverwrite.True;
    }
    return current;
}
exports.getOverwrite = getOverwrite;
function getMongoDbInc(inc) {
    return Object.keys(inc).filter(function (_) { return _ !== graphQLUpdateType_1.FICTIVE_INC; }).reduce(function (agg, key) {
        var _a;
        var value = inc[key];
        if (typeof value === "number") {
            return __assign(__assign({}, agg), (_a = {}, _a[key] = value, _a));
        }
        var child = getMongoDbInc(value);
        if (Object.keys(child).length === 0) {
            return agg;
        }
        return __assign(__assign({}, agg), common_1.addPrefixToProperties(child, key + "."));
    }, {});
}
exports.getMongoDbInc = getMongoDbInc;
