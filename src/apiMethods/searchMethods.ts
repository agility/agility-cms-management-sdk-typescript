import { Exception } from "../models/exception";
import { Options } from "../models/options";
import { SearchRequest, SearchResult } from "../models/search";
import { SearchNotAvailableException } from "../models/searchNotAvailableException";
import { ClientInstance } from "./clientInstance";

export class SearchMethods {
    _options!: Options;
    _clientInstance!: ClientInstance;

    constructor(options: Options) {
        this._options = options;
        this._clientInstance = new ClientInstance(this._options);
    }

    /**
     * Search everything in an instance: content items, components, pages, assets, models and containers.
     * Makes one request and never retries.
     *
     * Throws `SearchNotAvailableException` when search is not available for the instance yet (HTTP 501),
     * and `Exception` otherwise, for example with `statusCode` 400 for a blank query or an unknown kind or state.
     */
    async search(guid: string, request: SearchRequest): Promise<SearchResult> {
        try {
            let apiPath = `search`;
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, request);

            return resp.data as SearchResult;
        } catch (err) {
            if ((err as any)?.response?.status === 501) {
                throw new SearchNotAvailableException(`Unable to search the instance.`, err);
            }
            throw new Exception(`Unable to search the instance.`, err);
        }
    }
}
