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
exports.ModelMethods = void 0;
const clientInstance_1 = require("./clientInstance");
class ModelMethods {
    constructor(options) {
        this._options = options;
        this._clientInstance = new clientInstance_1.ClientInstance();
    }
    getContentModel(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `model/${id}`;
                const resp = yield this._clientInstance.executeGet(apiPath, this._options);
                return resp.data;
            }
            catch (err) {
                throw `Unable to retreive model for id: ${id}.`;
            }
        });
    }
    getContentModules(includeDefaults, includeModules = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `model/list/${includeDefaults}?includeModules=${includeModules}`;
                const resp = yield this._clientInstance.executeGet(apiPath, this._options);
                return resp.data;
            }
            catch (err) {
                throw `Unable to retreive content modules.`;
            }
        });
    }
    getPageModules(includeDefault) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `model/list-page-modules/${includeDefault}`;
                const resp = yield this._clientInstance.executeGet(apiPath, this._options);
                return resp.data;
            }
            catch (err) {
                throw `Unable to retreive page modules.`;
            }
        });
    }
    saveModel(model) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `model`;
                const resp = yield this._clientInstance.executePost(apiPath, this._options, model);
                return resp.data;
            }
            catch (err) {
                throw `Unable to save the model ${err}`;
            }
        });
    }
    deleteModel(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `model/${id}`;
                const resp = yield this._clientInstance.executeDelete(apiPath, this._options);
                return resp.data;
            }
            catch (err) {
                throw `Unable to delete the model ${err}`;
            }
        });
    }
}
exports.ModelMethods = ModelMethods;
