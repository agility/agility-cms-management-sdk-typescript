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
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstanceUserMethods = void 0;
const clientInstance_1 = require("./clientInstance");
class InstanceUserMethods {
    constructor(options) {
        this._options = options;
        this._clientInstance = new clientInstance_1.ClientInstance();
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `user/list`;
                const resp = yield this._clientInstance.executeGet(apiPath, this._options);
                return resp.data;
            }
            catch (err) {
                throw `Unable to retreive users.`;
            }
        });
    }
    saveUser(emailAddress, roles, firstName = null, lastName = null) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `user/save?emailAddress=${emailAddress}&firstName=${firstName}&lastName=${lastName}`;
                const resp = yield this._clientInstance.executePost(apiPath, this._options, roles);
                return resp.data;
            }
            catch (err) {
                throw `Unable to retreive users.`;
            }
        });
    }
    deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `user/delete/${userId}`;
                const resp = yield this._clientInstance.executeDelete(apiPath, this._options);
                return resp.data;
            }
            catch (err) {
                throw `Unable to delete the user for id: ${userId}`;
            }
        });
    }
}
exports.InstanceUserMethods = InstanceUserMethods;
