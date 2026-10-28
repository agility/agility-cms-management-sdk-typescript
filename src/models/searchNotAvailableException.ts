import { Exception } from "./exception";

/**
 * Thrown by `searchMethods.search` when the API answers 501: search is not available for this
 * instance yet. It isn't a transient failure, so don't retry it; fall back to listing or filtering
 * content instead.
 *
 * Check with `err instanceof SearchNotAvailableException`, or `err.name === "SearchNotAvailableException"`
 * when more than one copy of the SDK may be loaded. `statusCode` is 501.
 */
export class SearchNotAvailableException extends Exception {
    constructor(message: string, inner?: Error) {
        super(message, inner);
        // The SDK compiles to ES5, where a subclass of Error loses its prototype; restore it so
        // `instanceof SearchNotAvailableException` works.
        Object.setPrototypeOf(this, SearchNotAvailableException.prototype);
        this.name = "SearchNotAvailableException";
        this.statusCode = 501;
    }
}
