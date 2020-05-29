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
exports.logOnError = exports.getLogger = exports.setLogger = exports.warn = void 0;
var logger = {
    warn: function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return console.warn.apply(console, __spreadArrays(['\x1b[33m', 'graphql-to-mongodb warning:', '\x1b[0m'], args));
    },
};
function warn(message) {
    var optionalParams = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        optionalParams[_i - 1] = arguments[_i];
    }
    if (logger.warn) {
        logger.warn.apply(logger, __spreadArrays([message], optionalParams));
    }
}
exports.warn = warn;
function error(message) {
    var optionalParams = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        optionalParams[_i - 1] = arguments[_i];
    }
    if (logger.error) {
        logger.error.apply(logger, __spreadArrays([message], optionalParams));
    }
}
function setLogger(loggerObject) {
    logger = loggerObject || {};
}
exports.setLogger = setLogger;
function getLogger() {
    return __assign({}, logger);
}
exports.getLogger = getLogger;
function logOnError(func) {
    var wrappedFunction = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        try {
            return func.apply(void 0, args);
        }
        catch (exception) {
            error(exception);
            throw exception;
        }
    };
    return wrappedFunction;
}
exports.logOnError = logOnError;
