"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchState = void 0;
var BatchState;
(function (BatchState) {
    BatchState[BatchState["None"] = 0] = "None";
    BatchState[BatchState["Pending"] = 1] = "Pending";
    BatchState[BatchState["InProcess"] = 2] = "InProcess";
    BatchState[BatchState["Processed"] = 3] = "Processed";
    BatchState[BatchState["Deleted"] = 4] = "Deleted";
})(BatchState = exports.BatchState || (exports.BatchState = {}));
