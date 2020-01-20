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
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const find_config_1 = __importDefault(require("find-config"));
const path = __importStar(require("path"));
const core_1 = require("./core");
__export(require("./core"));
__export(require("./constants"));
__export(require("./logger"));
__export(require("./sender"));
const defaultConfig = process.argv.length === 3 && process.argv[2] === '--default';
const customConfig = process.argv.length === 4 && process.argv[2] === '--config';
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let configPath;
        try {
            configPath = defaultConfig
                ? find_config_1.default('api-mock.config.ts')
                : path.join(__dirname, process.argv[3]);
            const config = (yield Promise.resolve().then(() => __importStar(require(configPath)))).config;
            const mock = new core_1.MockServer(config);
            mock.listen();
        }
        catch (err) {
            console.log('ConfigError: could`t find config file (api-mock.config.ts): ' + configPath);
            process.exit(1);
        }
    });
}
if (defaultConfig || customConfig) {
    main();
}
//# sourceMappingURL=index.js.map