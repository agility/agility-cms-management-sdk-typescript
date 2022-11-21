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
exports.ContainerMethods = void 0;
const clientInstance_1 = require("./clientInstance");
class ContainerMethods {
    constructor(options) {
        this._options = options;
        this._clientInstance = new clientInstance_1.ClientInstance();
    }
    getContainerByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `container/${id}`;
                const resp = yield this._clientInstance.executeGet(apiPath, this._options);
                return resp.data;
            }
            catch (err) {
                throw `Unable to retreive the contianer for id: ${id}`;
            }
        });
    }
    getContainerByReferenceName(referenceName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `container/${referenceName}`;
                const resp = yield this._clientInstance.executeGet(apiPath, this._options);
                return resp.data;
            }
            catch (err) {
                throw `Unable to retreive the contianer for referenceName: ${referenceName}`;
            }
        });
    }
    getContainerSecurity(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `container/${id}/security`;
                const resp = yield this._clientInstance.executeGet(apiPath, this._options);
                return resp.data;
            }
            catch (err) {
                throw `Unable to retreive the contianer for id: ${id}`;
            }
        });
    }
    getContainerList() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `container/list`;
                const resp = yield this._clientInstance.executeGet(apiPath, this._options);
                return resp.data;
            }
            catch (err) {
                throw `Unable to retreive the contianer list`;
            }
        });
    }
    getNotificationList(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `container/${id}/notifications`;
                const resp = yield this._clientInstance.executeGet(apiPath, this._options);
                return resp.data;
            }
            catch (err) {
                throw `Unable to retreive the notifications for contianer id: ${id}`;
            }
        });
    }
    saveContainer(container) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `container`;
                const resp = yield this._clientInstance.executePost(apiPath, this._options, container);
                return resp.data;
            }
            catch (err) {
                throw `Unable to save the contianer`;
            }
        });
    }
    deleteContainer(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `container/${id}`;
                const resp = yield this._clientInstance.executeDelete(apiPath, this._options);
                return resp.data;
            }
            catch (err) {
                throw `Unable to delete the contianer for id: ${id}`;
            }
        });
    }
}
exports.ContainerMethods = ContainerMethods;
