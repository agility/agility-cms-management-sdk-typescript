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
exports.ClientInstance = void 0;
const axios_1 = __importDefault(require("axios"));
class ClientInstance {
    getInstance(options) {
        let baseUrl = options.determineBaseUrl(options.guid);
        let instance = axios_1.default.create({
            baseURL: `${baseUrl}/api/v1/instance/${options.guid}`
        });
        return instance;
    }
    executeGet(apiPath, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let instance = this.getInstance(options);
            try {
                const resp = yield instance.get(apiPath, {
                    headers: {
                        'Authorization': `Bearer ${options.token}`,
                        'Cache-Control': 'no-cache'
                    }
                });
                return resp;
            }
            catch (err) {
                throw err;
            }
        });
    }
    executeDelete(apiPath, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let instance = this.getInstance(options);
            try {
                const resp = yield instance.delete(apiPath, {
                    headers: {
                        'Authorization': `Bearer ${options.token}`,
                        'Cache-Control': 'no-cache'
                    }
                });
                return resp;
            }
            catch (err) {
                throw err;
            }
        });
    }
    executePost(apiPath, options, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let instance = this.getInstance(options);
            try {
                const resp = yield instance.post(apiPath, data, {
                    headers: {
                        'Authorization': `Bearer ${options.token}`,
                        'Cache-Control': 'no-cache'
                    }
                });
                return resp;
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.ClientInstance = ClientInstance;
