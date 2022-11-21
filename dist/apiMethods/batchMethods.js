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
exports.BatchMethods = void 0;
const clientInstance_1 = require("./clientInstance");
const batchState_1 = require("../enums/batchState.");
class BatchMethods {
    constructor(options) {
        this._options = options;
        this._clientInstance = new clientInstance_1.ClientInstance();
    }
    getBatch(batchID) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let apiPath = `batch/${batchID}`;
                const resp = yield this._clientInstance.executeGet(apiPath, this._options);
                return resp.data;
            }
            catch (err) {
                throw `Unable to retreive the batch for id: ${batchID}`;
            }
        });
    }
    Retry(method) {
        return __awaiter(this, void 0, void 0, function* () {
            let retryCount = this._options.retryCount;
            let duration = this._options.duration;
            if (retryCount <= 0)
                throw new Error('Number of retries has been exhausted.');
            while (true) {
                try {
                    let batch = yield method();
                    if (batch.batchState === batchState_1.BatchState.Processed) {
                        return batch;
                    }
                    else {
                        --retryCount;
                        if (--retryCount <= 0) {
                            throw new Error('Timeout exceeded but operation still in progress. Please check the Batches page in the Agility Content Manager app.');
                        }
                        yield this.delay(duration);
                    }
                }
                catch (err) {
                    throw new Error('Timeout exceeded but operation still in progress. Please check the Batches page in the Agility Content Manager app.');
                }
            }
        });
    }
    delay(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => setTimeout(resolve, ms));
        });
    }
}
exports.BatchMethods = BatchMethods;
