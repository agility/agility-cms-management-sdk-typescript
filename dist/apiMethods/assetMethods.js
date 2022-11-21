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
exports.AssetMethods = void 0;
const clientInstance_1 = require("./clientInstance");
class AssetMethods {
    constructor(options) {
        this._options = options;
        this._clientInstance = new clientInstance_1.ClientInstance();
    }
    deleteFile(mediaID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `asset/delete/${mediaID}`;
                const resp = yield this._clientInstance.executeDelete(apiPath, this._options);
                ;
                return resp.data;
            }
            catch (err) {
                throw `Unable to delete the media for mediaID: ${mediaID}`;
            }
        });
    }
    moveFile(mediaID, newFolder) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let folder = encodeURIComponent(newFolder);
                let apiPath = `asset/move/${mediaID}?newFolder=${folder}`;
                const resp = yield this._clientInstance.executePost(apiPath, this._options, null);
                return resp.data;
            }
            catch (err) {
                throw `Unable to move the media for mediaID: ${mediaID} ${err}`;
            }
        });
    }
    getMediaList(pageSize, recordOffset) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `asset/list?pageSize=${pageSize}&recordOffset=${recordOffset}`;
                const resp = yield this._clientInstance.executeGet(apiPath, this._options);
                return resp.data;
            }
            catch (err) {
                throw `Unable to retrieve assets for the website.`;
            }
        });
    }
    getAssetByID(mediaID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `asset/${mediaID}`;
                const resp = yield this._clientInstance.executeGet(apiPath, this._options);
                return resp.data;
            }
            catch (err) {
                throw `Unable to retrieve asset for mediaID ${mediaID}`;
            }
        });
    }
    getAssetByUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `asset?url=${url}`;
                const resp = yield this._clientInstance.executeGet(apiPath, this._options);
                return resp.data;
            }
            catch (err) {
                throw `Unable to retrieve asset for url ${url}`;
            }
        });
    }
    upload(formData, agilityFolderPath, groupingID = -1) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `asset/upload?folderPath=${agilityFolderPath}&groupingID=${groupingID}`;
                const resp = yield this._clientInstance.executePost(apiPath, this._options, formData);
                return resp.data;
            }
            catch (err) {
                throw `Unable to upload media.`;
            }
        });
    }
}
exports.AssetMethods = AssetMethods;
