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
var common_1 = require("./common");
var graphQLSortType_1 = require("./graphQLSortType");
;
;
function getMongoDbSort(sort) {
    return Object.keys(sort)
        .filter(function (key) { return key != graphQLSortType_1.FICTIVE_SORT; })
        .reduce(function (agg, key) {
        var _a;
        var value = sort[key];
        if (typeof value === 'number') {
            return __assign(__assign({}, agg), (_a = {}, _a[key] = value, _a));
        }
        var nested = getMongoDbSort(value);
        return __assign(__assign({}, agg), common_1.addPrefixToProperties(nested, key + "."));
    }, {});
}
exports.default = getMongoDbSort;
