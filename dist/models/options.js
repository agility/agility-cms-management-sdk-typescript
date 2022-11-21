"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Options = void 0;
class Options {
    determineBaseUrl(guid) {
        var seperator = guid.split('-');
        if (seperator[1] === 'd') {
            return "https://mgmt-dev.aglty.io";
        }
        else if (seperator[1] === 'u') {
            return "https://mgmt.aglty.io";
        }
        else if (seperator[1] === 'ca') {
            return "https://mgmt-ca.aglty.io";
        }
        else if (seperator[1] === 'eu') {
            return "https://mgmt-aus.aglty.io";
        }
        else if (seperator[1] === 'aus') {
            return "https://mgmt-aus.aglty.io";
        }
        return "https://mgmt.aglty.io";
    }
}
exports.Options = Options;
