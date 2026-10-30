import { Exception } from "../models/exception";
import { Options } from "../models/options";
import { UrlRedirectionDeleteResult } from "../models/urlRedirection";
import { ClientInstance } from "./clientInstance";

/** The most redirections the API accepts in one request. */
export const MAX_URL_REDIRECTIONS_PER_REQUEST = 250;

export class UrlRedirectionMethods {
    _options!: Options;
    _clientInstance!: ClientInstance;

    constructor(options: Options) {
        this._options = options;
        this._clientInstance = new ClientInstance(this._options);
    }

    /**
     * Delete up to 250 URL redirections in one request.
     *
     * IDs that do not match an active redirection are returned in `notFound` instead of failing
     * the request, so deleting something that is already gone is safe.
     */
    async deleteUrlRedirections(guid: string, urlRedirectionIDs: number[]): Promise<UrlRedirectionDeleteResult> {
        if (!urlRedirectionIDs || urlRedirectionIDs.length === 0) {
            throw new Exception(`At least one URL redirection ID is required.`);
        }
        if (urlRedirectionIDs.length > MAX_URL_REDIRECTIONS_PER_REQUEST) {
            throw new Exception(
                `Cannot delete more than ${MAX_URL_REDIRECTIONS_PER_REQUEST} URL redirections at a time (got ${urlRedirectionIDs.length}).`
            );
        }
        try {
            let apiPath = `url-redirections?ids=${urlRedirectionIDs.join(",")}`;
            const resp = await this._clientInstance.executeDelete(apiPath, guid, this._options.token);

            const data = resp.data ?? {};
            return {
                deleted: data.deleted ?? [],
                notFound: data.notFound ?? [],
            };
        } catch (err) {
            throw new Exception(`Unable to delete the URL redirections.`, err);
        }
    }
}
