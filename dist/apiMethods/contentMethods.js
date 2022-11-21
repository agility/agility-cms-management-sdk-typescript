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
exports.ContentMethods = void 0;
const clientInstance_1 = require("./clientInstance");
const batchMethods_1 = require("./batchMethods");
class ContentMethods {
    constructor(options) {
        this._options = options;
        this._clientInstance = new clientInstance_1.ClientInstance();
        this._batchMethods = new batchMethods_1.BatchMethods(this._options);
    }
    getContentItem(contentID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `${this._options.locale}/item/${contentID}`;
                const resp = yield this._clientInstance.executeGet(apiPath, this._options);
                return resp.data;
            }
            catch (err) {
                throw `Unable to retreive the content for id: ${contentID}`;
            }
        });
    }
    publishContent(contentID, comments = null) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `${this._options.locale}/item/${contentID}/publish?comments=${comments}`;
                const resp = yield this._clientInstance.executeGet(apiPath, this._options);
                let batchID = resp.data;
                var batch = yield this._batchMethods.Retry(() => __awaiter(this, void 0, void 0, function* () { return yield this._batchMethods.getBatch(batchID); }));
                let contentIDs = [];
                batch.items.forEach(element => contentIDs.push(element.itemID));
                return contentIDs;
            }
            catch (err) {
                throw `Unable to publish the content for id: ${contentID}`;
            }
        });
    }
    unPublishContent(contentID, comments = null) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `${this._options.locale}/item/${contentID}/unpublish?comments=${comments}`;
                const resp = yield this._clientInstance.executeGet(apiPath, this._options);
                let batchID = resp.data;
                var batch = yield this._batchMethods.Retry(() => __awaiter(this, void 0, void 0, function* () { return yield this._batchMethods.getBatch(batchID); }));
                let contentIDs = [];
                batch.items.forEach(element => contentIDs.push(element.itemID));
                return contentIDs;
            }
            catch (err) {
                throw `Unable to un-publish the content for id: ${contentID}`;
            }
        });
    }
    contentRequestApproval(contentID, comments = null) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `${this._options.locale}/item/${contentID}/request-approval?comments=${comments}`;
                const resp = yield this._clientInstance.executeGet(apiPath, this._options);
                let batchID = resp.data;
                var batch = yield this._batchMethods.Retry(() => __awaiter(this, void 0, void 0, function* () { return yield this._batchMethods.getBatch(batchID); }));
                let contentIDs = [];
                batch.items.forEach(element => contentIDs.push(element.itemID));
                return contentIDs;
            }
            catch (err) {
                throw `Unable to request approval the content for id: ${contentID}`;
            }
        });
    }
    approveContent(contentID, comments = null) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `${this._options.locale}/item/${contentID}/approve?comments=${comments}`;
                const resp = yield this._clientInstance.executeGet(apiPath, this._options);
                let batchID = resp.data;
                var batch = yield this._batchMethods.Retry(() => __awaiter(this, void 0, void 0, function* () { return yield this._batchMethods.getBatch(batchID); }));
                let contentIDs = [];
                batch.items.forEach(element => contentIDs.push(element.itemID));
                return contentIDs;
            }
            catch (err) {
                throw `Unable to approve the content for id: ${contentID}`;
            }
        });
    }
    declineContent(contentID, comments = null) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `${this._options.locale}/item/${contentID}/decline?comments=${comments}`;
                const resp = yield this._clientInstance.executeGet(apiPath, this._options);
                let batchID = resp.data;
                var batch = yield this._batchMethods.Retry(() => __awaiter(this, void 0, void 0, function* () { return yield this._batchMethods.getBatch(batchID); }));
                let contentIDs = [];
                batch.items.forEach(element => contentIDs.push(element.itemID));
                return contentIDs;
            }
            catch (err) {
                throw `Unable to decline the content for id: ${contentID}`;
            }
        });
    }
    deleteContent(contentID, comments = null) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `${this._options.locale}/item/${contentID}?comments=${comments}`;
                const resp = yield this._clientInstance.executeDelete(apiPath, this._options);
                let batchID = resp.data;
                var batch = yield this._batchMethods.Retry(() => __awaiter(this, void 0, void 0, function* () { return yield this._batchMethods.getBatch(batchID); }));
                let contentIDs = [];
                batch.items.forEach(element => contentIDs.push(element.itemID));
                return contentIDs;
            }
            catch (err) {
                throw `Unable to delete the content for id: ${contentID}`;
            }
        });
    }
    saveContentItem(contentItem) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `${this._options.locale}/item`;
                const resp = yield this._clientInstance.executePost(apiPath, this._options, contentItem);
                let batchID = resp.data;
                var batch = yield this._batchMethods.Retry(() => __awaiter(this, void 0, void 0, function* () { return yield this._batchMethods.getBatch(batchID); }));
                let contentIDs = [];
                batch.items.forEach(element => contentIDs.push(element.itemID));
                return contentIDs;
            }
            catch (err) {
                throw 'Unable to create content.';
            }
        });
    }
    saveContentItems(contentItems) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `${this._options.locale}/item/multi`;
                const resp = yield this._clientInstance.executePost(apiPath, this._options, contentItems);
                let batchID = resp.data;
                var batch = yield this._batchMethods.Retry(() => __awaiter(this, void 0, void 0, function* () { return yield this._batchMethods.getBatch(batchID); }));
                let contentIDs = [];
                batch.items.forEach(element => contentIDs.push(element.itemID));
                return contentIDs;
            }
            catch (err) {
                throw 'Unable to create contents.';
            }
        });
    }
}
exports.ContentMethods = ContentMethods;
