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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGraphQLUpdateArgs = exports.getMongoDbUpdateResolver = void 0;
var graphQLFilterType_1 = require("./graphQLFilterType");
var graphQLUpdateType_1 = require("./graphQLUpdateType");
var mongoDbFilter_1 = require("./mongoDbFilter");
var mongoDbUpdate_1 = require("./mongoDbUpdate");
var mongoDbUpdateValidation_1 = require("./mongoDbUpdateValidation");
var graphql_1 = require("graphql");
var mongoDbProjection_1 = require("./mongoDbProjection");
;
var defaultOptions = {
    differentOutputType: false,
    validateUpdateArgs: false,
    overwrite: false,
    excludedFields: [],
    isResolvedField: undefined
};
function getMongoDbUpdateResolver(graphQLType, updateCallback, updateOptions) {
    var _this = this;
    if (!graphql_1.isType(graphQLType))
        throw 'getMongoDbUpdateResolver must recieve a graphql type';
    if (typeof updateCallback !== 'function')
        throw 'getMongoDbUpdateResolver must recieve an updateCallback';
    var requiredUpdateOptions = __assign(__assign({}, defaultOptions), updateOptions);
    return function (source, args, context, info) { return __awaiter(_this, void 0, void 0, function () {
        var filter, mongoUpdate, projection;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    filter = mongoDbFilter_1.getMongoDbFilter(graphQLType, args.filter);
                    if (requiredUpdateOptions.validateUpdateArgs)
                        mongoDbUpdateValidation_1.validateUpdateArgs(args.update, graphQLType, requiredUpdateOptions);
                    mongoUpdate = mongoDbUpdate_1.getMongoDbUpdate(args.update, requiredUpdateOptions.overwrite);
                    projection = requiredUpdateOptions.differentOutputType ? undefined : mongoDbProjection_1.getMongoDbProjection(info, graphQLType, requiredUpdateOptions);
                    return [4 /*yield*/, updateCallback(filter, mongoUpdate.update, mongoUpdate.options, projection, source, args, context, info)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    }); };
}
exports.getMongoDbUpdateResolver = getMongoDbUpdateResolver;
function getGraphQLUpdateArgs(graphQLType) {
    return {
        filter: { type: new graphql_1.GraphQLNonNull(graphQLFilterType_1.getGraphQLFilterType(graphQLType)) },
        update: { type: new graphql_1.GraphQLNonNull(graphQLUpdateType_1.getGraphQLUpdateType(graphQLType)) }
    };
}
exports.getGraphQLUpdateArgs = getGraphQLUpdateArgs;
