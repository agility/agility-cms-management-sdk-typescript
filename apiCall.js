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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
//import { ApiClient } from './apiClient';
var index = require("./src/index");
var FormData = require('form-data');
var method = function () { return __awaiter(void 0, void 0, void 0, function () {
    var op, apiClient, resp;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                op = new index.Options();
                op.token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ik9qWGMxS3ViV21DS095TXRtOTRsbCJ9.eyJpc3MiOiJodHRwczovL2Rldi0tbG9naW4uYWdpbGl0eWNtcy5jb20vIiwic3ViIjoib2F1dGgyfE1pY3Jvc29mdHwzRGpvbVVsWTJNcDdfdHQtYUlfVmFPQlB2RV9YQWN6d2w5NVdsdWsxa3E0IiwiYXVkIjpbImh0dHBzOi8vYWdpbGl0eWNtcy1kZXYudXMuYXV0aDAuY29tL2FwaS92Mi8iLCJodHRwczovL2FnaWxpdHljbXMtZGV2LnVzLmF1dGgwLmNvbS91c2VyaW5mbyJdLCJpYXQiOjE2NzQxNTU2OTMsImV4cCI6MTY3NDI0MjA5MywiYXpwIjoiUDQ0R01VNnpSaTlkaFZoeHhaWjhMUFpEdTF2S1VLd1giLCJzY29wZSI6Im9wZW5pZCBwcm9maWxlIGVtYWlsIG9mZmxpbmVfYWNjZXNzIn0.f7oU0yeVmm8IptBf2kqY2uM0NxZMqG3OtxD7DK22fdmXyJFV5njgG5qUVirZYxkkH1-Yz5Ve17tPC8Z9V3zedBRPpXSqArwHouUxgTso0rYdyQf0aZGonYVlyT8Fi7WR4q2uf9aVYeTa90_-0_cxNh0G9lprt_athiIx9k6UnoPbDriUO2pH2Aia6cxQdmU3Ke0JuETME-0X9bcoN3cuLrHYI--VvzLSUQdSoBhfEv_CaR3VYBlblCrBZmX1V2d5-9QKS3fSkp6f7wz-bu36WEhPG_Bk7unBCKdvXSLvxOYliJfVSlXdHzhIFNicUkr6kRqyuQrOUfBWrmVcv--g_A';
                apiClient = new index.ApiClient(op);
                return [4 /*yield*/, apiClient.assetMethods.createFolder('AttachmentLists/new-folder12345', '9670e398-d')];
            case 1:
                resp = _a.sent();
                //let resp = await contentMethods.getContentItems('TestContainers');
                console.log(JSON.stringify(resp));
                return [2 /*return*/];
        }
    });
}); };
method();
