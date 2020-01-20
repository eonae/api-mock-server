"use strict";
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
var express_1 = require("express");
var body_parser_1 = require("body-parser");
var logger_1 = require("../logger");
var MockServer = (function () {
    function MockServer(config) {
        var _this = this;
        this.logger = new logger_1.Logger(config.verbose);
        var handlers = config.handlers || {};
        this.handlers = Object.entries(handlers)
            .reduce(function (acc, _a) {
            var key = _a[0], handler = _a[1];
            _this.checkKey(key);
            acc[key] = {
                persistent: false,
                response: handler
            };
            return acc;
        }, {});
        this.handlers['default'] = config.default
            ? { persistent: true, response: config.default }
            : { persistent: true, response: { status: 404 } };
        this.config = config;
        this.app = express_1.default();
        this.app.use(body_parser_1.default.json());
        this.app.use(body_parser_1.default.urlencoded({
            extended: true
        }));
        this.app.use(function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var key, handler, response, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        key = req.method + " " + req.url;
                        if (!this.handlers[key]) {
                            key = 'default';
                        }
                        handler = this.handlers[key];
                        this.logger.info('handling:', key);
                        if (!handler.persistent) {
                            this.logger.info('removing handler:', key);
                            delete this.handlers[key];
                        }
                        if (!(typeof handler.response === 'function')) return [3, 2];
                        return [4, handler.response(req)];
                    case 1:
                        _a = _b.sent();
                        return [3, 3];
                    case 2:
                        _a = handler.response;
                        _b.label = 3;
                    case 3:
                        response = _a;
                        res.status(response.status);
                        if (response.headers) {
                            Object.entries(response.headers)
                                .forEach(function (_a) {
                                var header = _a[0], value = _a[1];
                                return res.set(header, value);
                            });
                        }
                        this.logger.info('responding:', response);
                        res.json(response.data);
                        next();
                        return [2];
                }
            });
        }); });
        this.app.use(function (req, res, next) {
            var keys = Object.keys(_this.handlers);
            if (keys.length === 1 && keys[0] === 'default') {
                _this.logger.info('MOCK-SERVER: No keys left! Stopping...');
                _this.stop().then(function () { return next(); });
            }
        });
    }
    MockServer.prototype.checkKey = function (key) {
        var method = key.split(' ')[0];
        if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
            throw new Error("<" + method + "> is not valid http method.");
        }
    };
    MockServer.prototype.pushHandler = function (verb, url, handler, options) {
        var persistent = options
            ? options.persistent || false
            : false;
        this.handlers[verb + " " + url] = {
            persistent: persistent,
            response: handler
        };
        return this;
    };
    MockServer.prototype.pushResponse = function (verb, url, response, options) {
        var persistent = options
            ? options.persistent || false
            : false;
        this.handlers[verb + " " + url] = {
            persistent: persistent,
            response: function () { return response; }
        };
        return this;
    };
    MockServer.prototype.clear = function () {
        this.handlers = {};
    };
    MockServer.prototype.listen = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.server && _this.server.listening) {
                resolve();
            }
            try {
                _this.server = (_this.server || _this.app)
                    .listen(_this.config.port, function () {
                    _this.logger.info('Listening port', _this.config.port);
                    _this.logger.info('Endpoints:', Object.keys(_this.handlers));
                    resolve();
                });
            }
            catch (err) {
                reject(err);
            }
        });
    };
    MockServer.prototype.stop = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.server) {
                _this.server.close(function (err) {
                    if (err) {
                        _this.logger.error(err.message);
                        reject(err);
                    }
                    _this.logger.info('Server closed');
                    resolve();
                });
            }
        });
    };
    return MockServer;
}());
exports.MockServer = MockServer;
//# sourceMappingURL=mock-server.class.js.map