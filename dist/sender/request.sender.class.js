"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const constants_1 = require("../constants");
exports.bearer = (token) => 'Bearer ' + token;
exports.getCsrf = (res) => res.header['x-csrf-token'];
class RequestSender {
    constructor(app) {
        this.app = app;
    }
    sendRequest(method, url, options) {
        let req = supertest_1.default(this.app)[method.toLowerCase()](url);
        if (options) {
            const { data, jwt, csrf, headers } = options;
            if (jwt) {
                req = req.set(constants_1.AUTHORIZATION, exports.bearer(jwt));
            }
            if (csrf) {
                req = req.set(constants_1.X_CSRF_TOKEN, csrf);
            }
            if (headers) {
                Object.entries(options.headers).forEach(([header, value]) => {
                    req = req.set(header, value);
                });
            }
            if (data) {
                req = req.send(data);
            }
        }
        return req;
    }
}
exports.RequestSender = RequestSender;
//# sourceMappingURL=request.sender.class.js.map