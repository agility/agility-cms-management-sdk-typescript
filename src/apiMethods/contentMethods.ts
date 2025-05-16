import { Options } from "../types/options";
import { ClientInstance } from "./clientInstance";
import { ContentItem, ContentList } from "../types/contentItem";
import { BatchMethods } from "./batchMethods";
import { Exception } from "../errors/exception";
import { ContentListFilterModel } from "../types/contentListFilterModel";
import { ContentItemHistory } from "../types/contentItemHistory";
import { ItemComments } from "../types/itemComments";
import { ListParams } from "../types/listParams";
import { Batch } from "../types/batch";

export class ContentMethods{
    _options!: Options;
    _clientInstance!: ClientInstance;
    _batchMethods: BatchMethods;

    constructor(options: Options){
        this._options = options;
        this._clientInstance = new ClientInstance(this._options);
        this._batchMethods = new BatchMethods(this._options);
    }

    /**
     * Retrieves a specific content item by its ID.
     * @param contentID The numeric ID of the content item.
     * @param guid The instance GUID.
     * @param locale The locale code.
     * @returns A promise resolving to the ContentItem object.
     */
    async getContentItem(contentID: number, guid: string, locale: string): Promise<ContentItem> {
        try{
            let apiPath = `${locale}/item/${contentID}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            if (!resp?.contentID) { throw new Error('Invalid API response structure for ContentItem'); }
            return resp as ContentItem;
        } catch(err: any){
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to retrieve the content for id: ${contentID}`, error);
        }
    }

    /**
     * Publishes a content item. This is a batch operation.
     * @param contentID The ID of the content item to publish.
     * @param guid The instance GUID.
     * @param locale The locale code.
     * @param comments Optional comments for the operation.
     * @returns A promise resolving to the final Batch object after the operation completes.
     */
    async publishContent(contentID: number, guid: string, locale: string, comments?: string): Promise<Batch> {
        try{
            const commentsParam = comments ? `?comments=${encodeURIComponent(comments)}` : '';
            let apiPath = `${locale}/item/${contentID}/publish${commentsParam}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            if (typeof resp !== 'number') {
                throw new Error(`Publish content for id ${contentID} did not return a valid batch ID number.`);
            }
            let batchID = resp as number;
            return await this._batchMethods.Retry(async () => this._batchMethods.getBatch(batchID, guid));
        } catch(err: any){
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to publish the content for id: ${contentID}`, error);
        }
    }

    /**
     * Un-publishes a content item. This is a batch operation.
     * @param contentID The ID of the content item to un-publish.
    async unPublishContent (contentID: number, guid: string, locale: string, comments?: string){
        try{
            let apiPath = `${locale}/item/${contentID}/unpublish?comments=${comments}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            let batchID = resp as number;
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID, guid));
            return batch;
        } catch(err: any){
            throw new Exception(`Unable to un-publish the content for id: ${contentID}`, err as Error);
        }
    }

    async contentRequestApproval (contentID: number, guid: string, locale: string, comments?: string){
        try{
            let apiPath = `${locale}/item/${contentID}/request-approval?comments=${comments}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            let batchID = resp as number;
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID, guid));
            return batch;
        } catch(err: any){
            throw new Exception(`Unable to request approval the content for id: ${contentID}`, err as Error);
        }
    }

    async approveContent (contentID: number, guid: string, locale: string, comments?: string){
        try{
            let apiPath = `${locale}/item/${contentID}/approve?comments=${comments}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            let batchID = resp as number;
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID, guid));
            return batch;
        } catch(err: any){
            throw new Exception(`Unable to approve the content for id: ${contentID}`, err as Error);
        }
    }

    async declineContent (contentID: number, guid: string, locale: string, comments?: string){
        try{
            let apiPath = `${locale}/item/${contentID}/decline?comments=${comments}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            let batchID = resp as number;
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID, guid));
            return batch;
        } catch(err: any){
            throw new Exception(`Unable to decline the content for id: ${contentID}`, err as Error);
        }
    }

    async deleteContent (contentID: number, guid: string, locale: string, comments?: string){
        try{
            let apiPath = `${locale}/item/${contentID}?comments=${comments}`;
            const resp = await this._clientInstance.executeDelete(apiPath, guid, this._options.token);

            const batchIDStr = await resp.text();
            let batchID = parseInt(batchIDStr, 10);
            
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID, guid));
            return batch;
        } catch(err: any){
            throw new Exception(`Unable to delete the content for id: ${contentID}`, err as Error);
        }
    }

    async saveContentItem(contentItem: ContentItem, guid: string, locale: string){
        try{
            let apiPath = `${locale}/item`;
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, contentItem);

            let batchID = resp as number;
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID, guid));
            
            return batch;
        } catch(err: any){
            throw new Exception('Unable to create content.', err as Error);
        }
    }

    async saveContentItems(contentItems: ContentItem[], guid: string, locale: string){
        try{
            let apiPath = `${locale}/item/multi`;
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, contentItems);

            let batchID = resp as number;
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID, guid));
            
            return batch;
        } catch(err: any){
            throw new Exception('Unable to create contents.', err as Error);
        }
    }

    /**
     * Retrieves a list of content items based on filter parameters (using GET).
     * @param referenceName The reference name of the content list/model.
     * @param guid The instance GUID.
     * @param locale The locale code.
     * @param listParams Parameters for filtering, sorting, pagination.
     * @returns A promise resolving to a ContentList object.
     */
    async getContentItems(referenceName: string, guid: string, locale: string, listParams: ListParams): Promise<ContentList> {
        try {
            let apiPath = `${locale}/list/${referenceName}?filter=${listParams.filter}&fields=${listParams.fields}&sortDirection=${listParams.sortDirection}&sortField=${listParams.sortField}&take=${listParams.take}&skip=${listParams.skip}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp as ContentList;
        } catch(err: any) {
            throw new Exception(`Unable retreive the content details for reference name: ${referenceName}`, err as Error);
        }
    }

    /**
     * Retrieves a list of content items based on filter parameters (using POST for complex filters).
     * @param referenceName The reference name of the content list/model.
     * @param guid The instance GUID.
     * @param locale The locale code.
     * @param listParams Parameters for sorting, pagination.
     * @param filterObject Optional complex filter criteria object.
     * @returns A promise resolving to a ContentList object.
     */
    async getContentList(referenceName: string, guid: string, locale: string, listParams: ListParams, filterObject?: ContentListFilterModel): Promise<ContentList> {
        try {
            let apiPath = `${locale}/list/${referenceName}?fields=${listParams.fields}&sortDirection=${listParams.sortDirection}&sortField=${listParams.sortField}&take=${listParams.take}&skip=${listParams.skip}&showDeleted=${listParams.showDeleted}`
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, filterObject)

            return resp as ContentList;
        } catch(err: any){
            throw new Exception(`Unable retreive the content details for list with reference name: ${referenceName}`, err as Error);
        }
    }
    
    /**
     * Retrieves the history of changes for a specific content item.
     * @param locale The locale code.
     * @param guid The instance GUID.
     * @param contentID The ID of the content item.
     * @param take Max number of history records (default 50).
     * @param skip Number of records to skip (default 0).
     * @returns A promise resolving to a ContentItemHistory object.
     */
    async getContentHistory(locale: string, guid: string, contentID: number, take: number = 50, skip: number = 0): Promise<ContentItemHistory> {
        try {
            let apiPath = `${locale}/item/${contentID}/history?take=${take}&skip=${skip}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp as ContentItemHistory;
        } catch(err: any){
            throw new Exception(`Unable to retrieve history for contentID: ${contentID}`, err as Error)
        }
    }

    /**
     * Retrieves the comments for a specific content item.
     * @param locale The locale code.
     * @param guid The instance GUID.
     * @param contentID The ID of the content item.
     * @param take Max number of comments (default 50).
     * @param skip Number of comments to skip (default 0).
     * @returns A promise resolving to an ItemComments object.
     */
    async getContentComments(locale: string, guid: string, contentID: number, take: number = 50, skip: number = 0): Promise<ItemComments> {
        try {
            let apiPath = `${locale}/item/${contentID}/comments?take=${take}&skip=${skip}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp as ItemComments;
        } catch(err: any){
            throw new Exception(`Unable to retrieve comments for contentID: ${contentID}`, err as Error)
        }
    }
}