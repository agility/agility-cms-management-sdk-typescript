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
exports.PageMethods = void 0;
const clientInstance_1 = require("./clientInstance");
const batchMethods_1 = require("./batchMethods");
class PageMethods {
    constructor(options) {
        this._options = options;
        this._clientInstance = new clientInstance_1.ClientInstance();
        this._batchMethods = new batchMethods_1.BatchMethods(this._options);
    }
    getSitemap() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `${this._options.locale}/sitemap`;
                const resp = yield this._clientInstance.executeGet(apiPath, this._options);
                return resp.data;
            }
            catch (err) {
                throw `Unable to retreive sitemap.`;
            }
        });
    }
    getPage(pageID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `${this._options.locale}/page/${pageID}`;
                const resp = yield this._clientInstance.executeGet(apiPath, this._options);
                return resp.data;
            }
            catch (err) {
                throw `Unable to retreive page for id ${pageID}.`;
            }
        });
    }
    publishPage(pageID, comments = null) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `${this._options.locale}/page/${pageID}/publish?comments=${comments}`;
                const resp = yield this._clientInstance.executeGet(apiPath, this._options);
                let batchID = resp.data;
                var batch = yield this._batchMethods.Retry(() => __awaiter(this, void 0, void 0, function* () { return yield this._batchMethods.getBatch(batchID); }));
                let pageIDs = [];
                batch.items.forEach(element => pageIDs.push(element.itemID));
                return pageIDs;
            }
            catch (err) {
                throw `Unable to publish the page for id: ${pageID}`;
            }
        });
    }
    unPublishPage(pageID, comments = null) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `${this._options.locale}/page/${pageID}/unpublish?comments=${comments}`;
                const resp = yield this._clientInstance.executeGet(apiPath, this._options);
                let batchID = resp.data;
                var batch = yield this._batchMethods.Retry(() => __awaiter(this, void 0, void 0, function* () { return yield this._batchMethods.getBatch(batchID); }));
                let pageIDs = [];
                batch.items.forEach(element => pageIDs.push(element.itemID));
                return pageIDs;
            }
            catch (err) {
                throw `Unable to un-publish the page for id: ${pageID}`;
            }
        });
    }
    pageRequestApproval(pageID, comments = null) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `${this._options.locale}/page/${pageID}/request-approval?comments=${comments}`;
                const resp = yield this._clientInstance.executeGet(apiPath, this._options);
                let batchID = resp.data;
                var batch = yield this._batchMethods.Retry(() => __awaiter(this, void 0, void 0, function* () { return yield this._batchMethods.getBatch(batchID); }));
                let pageIDs = [];
                batch.items.forEach(element => pageIDs.push(element.itemID));
                return pageIDs;
            }
            catch (err) {
                throw `Unable to request approval the page for id: ${pageID}`;
            }
        });
    }
    approvePage(pageID, comments = null) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `${this._options.locale}/page/${pageID}/approve?comments=${comments}`;
                const resp = yield this._clientInstance.executeGet(apiPath, this._options);
                let batchID = resp.data;
                var batch = yield this._batchMethods.Retry(() => __awaiter(this, void 0, void 0, function* () { return yield this._batchMethods.getBatch(batchID); }));
                let pageIDs = [];
                batch.items.forEach(element => pageIDs.push(element.itemID));
                return pageIDs;
            }
            catch (err) {
                throw `Unable to approve the page for id: ${pageID}`;
            }
        });
    }
    declinePage(pageID, comments = null) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `${this._options.locale}/page/${pageID}/decline?comments=${comments}`;
                const resp = yield this._clientInstance.executeGet(apiPath, this._options);
                let batchID = resp.data;
                var batch = yield this._batchMethods.Retry(() => __awaiter(this, void 0, void 0, function* () { return yield this._batchMethods.getBatch(batchID); }));
                let pageIDs = [];
                batch.items.forEach(element => pageIDs.push(element.itemID));
                return pageIDs;
            }
            catch (err) {
                throw `Unable to decline the page for id: ${pageID}`;
            }
        });
    }
    deletePage(pageID, comments = null) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `${this._options.locale}/page/${pageID}?comments=${comments}`;
                const resp = yield this._clientInstance.executeDelete(apiPath, this._options);
                let batchID = resp.data;
                var batch = yield this._batchMethods.Retry(() => __awaiter(this, void 0, void 0, function* () { return yield this._batchMethods.getBatch(batchID); }));
                let pageIDs = [];
                batch.items.forEach(element => pageIDs.push(element.itemID));
                return pageIDs;
            }
            catch (err) {
                throw `Unable to delete the page for id: ${pageID}`;
            }
        });
    }
    savePage(pageItem, parentPageID = -1, placeBeforePageItemID = -1) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `${this._options.locale}/page?parentPageID=${parentPageID}&placeBeforePageItemID=${placeBeforePageItemID}`;
                const resp = yield this._clientInstance.executePost(apiPath, this._options, pageItem);
                let batchID = resp.data;
                var batch = yield this._batchMethods.Retry(() => __awaiter(this, void 0, void 0, function* () { return yield this._batchMethods.getBatch(batchID); }));
                let pageIDs = [];
                batch.items.forEach(element => pageIDs.push(element.itemID));
                return pageIDs;
            }
            catch (err) {
                throw `Unable to create page. ${err}`;
            }
        });
    }
}
exports.PageMethods = PageMethods;
