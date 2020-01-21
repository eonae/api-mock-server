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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const logger_1 = require("../logger");
class MockServer {
    constructor(config) {
        this.logger = new logger_1.Logger(config.verbose);
        const handlers = config.handlers || {};
        this.handlers = Object.entries(handlers)
            .reduce((acc, [key, handler]) => {
            this.checkKey(key);
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
        this.app.use((req, res, next) => __awaiter(this, void 0, void 0, function* () {
            let key = `${req.method} ${req.url}`;
            if (!this.handlers[key]) {
                key = 'default';
            }
            const handler = this.handlers[key];
            this.logger.info('handling:', key);
            if (!handler.persistent) {
                this.logger.info('removing handler:', key);
                delete this.handlers[key];
            }
            const response = typeof handler.response === 'function'
                ? yield handler.response(req)
                : handler.response;
            res.status(response.status);
            if (response.headers) {
                Object.entries(response.headers)
                    .forEach(([header, value]) => res.set(header, value));
            }
            this.logger.info('responding:', response);
            res.json(response.data);
            next();
        }));
        this.app.use((req, res, next) => {
            const keys = Object.keys(this.handlers);
            if (keys.length === 1 && keys[0] === 'default') {
                this.logger.info('MOCK-SERVER: No keys left! Stopping...');
                this.stop().then(() => next());
            }
        });
    }
    checkKey(key) {
        const method = key.split(' ')[0];
        if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
            throw new Error(`<${method}> is not valid http method.`);
        }
    }
    pushHandler(verb, url, handler, options) {
        const persistent = options
            ? options.persistent || false
            : false;
        this.handlers[`${verb} ${url}`] = {
            persistent,
            response: handler
        };
        return this;
    }
    pushResponse(verb, url, response, options) {
        const persistent = options
            ? options.persistent || false
            : false;
        this.handlers[`${verb} ${url}`] = {
            persistent,
            response: () => response
        };
        return this;
    }
    clear() {
        this.handlers = {};
    }
    listen() {
        return new Promise((resolve, reject) => {
            if (this.server && this.server.listening) {
                resolve();
            }
            try {
                this.server = this.app
                    .listen(this.config.port, () => {
                    this.logger.info('Listening port', this.config.port);
                    this.logger.info('Endpoints:', Object.keys(this.handlers));
                    resolve();
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }
    stop() {
        return new Promise((resolve, reject) => {
            if (this.server) {
                this.server.close(err => {
                    if (err) {
                        this.logger.error(err.message);
                        reject(err);
                    }
                    this.server = null;
                    this.logger.info('Server closed');
                    resolve();
                });
            }
        });
    }
}
exports.MockServer = MockServer;
//# sourceMappingURL=mock-server.class.js.map