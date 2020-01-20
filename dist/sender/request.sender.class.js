"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var supertest_1 = require("supertest");
var constants_1 = require("../constants");
exports.bearer = function (token) { return 'Bearer ' + token; };
exports.getCsrf = function (res) { return res.header['x-csrf-token']; };
var RequestSender = (function () {
    function RequestSender(app) {
        this.app = app;
    }
    RequestSender.prototype.sendRequest = function (method, url, options) {
        var req = supertest_1.default(this.app)[method.toLowerCase()](url);
        if (options) {
            var data = options.data, jwt = options.jwt, csrf = options.csrf, headers = options.headers;
            if (jwt) {
                req = req.set(constants_1.AUTHORIZATION, exports.bearer(jwt));
            }
            if (csrf) {
                req = req.set(constants_1.X_CSRF_TOKEN, csrf);
            }
            if (headers) {
                Object.entries(options.headers).forEach(function (_a) {
                    var header = _a[0], value = _a[1];
                    req = req.set(header, value);
                });
            }
            if (data) {
                req = req.send(data);
            }
        }
        return req;
    };
    return RequestSender;
}());
exports.RequestSender = RequestSender;
//# sourceMappingURL=request.sender.class.js.map