"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Logger {
    constructor(verbose) {
        this.verbose = verbose;
    }
    info(...data) {
        if (!this.verbose)
            return;
        console.log('MOCK-SERVER:', ...data);
    }
    error(errMsg) {
        if (!this.verbose)
            return;
        console.log('MOCK-SERVER Error: ' + errMsg);
    }
}
exports.Logger = Logger;
//# sourceMappingURL=logger.class.js.map