import { Options } from "../models/options";
import { ClientInstance } from "./clientInstance";
import { ContentItem, ContentList } from "../models/contentItem";
import { BatchMethods } from "./batchMethods";
import { Exception } from "../models/exception";

export class ContentMethods{
    _options!: Options;
    _clientInstance!: ClientInstance;
    _batchMethods: BatchMethods;

    constructor(options: Options){
        this._options = options;
        this._clientInstance = new ClientInstance(options);
        this._batchMethods = new BatchMethods(this._options);
    }

   async getContentItem(contentID: number, guid: string, locale: string){
        try{
            let apiPath = `${locale}/item/${contentID}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as ContentItem;
        } catch(err){
            throw new Exception(`Unable to retreive the content for id: ${contentID}`, err);
        }
    }

     async publishContent (contentID: number, guid: string, locale: string, comments: string = null ){
        try{
            let apiPath = `${locale}/item/${contentID}/publish?comments=${comments}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            let batchID = resp.data as number;
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID, guid));
            let contentIDs: number[]= [];

            batch.items.forEach(element => contentIDs.push(element.itemID));
            return contentIDs;
        } catch(err){
            throw new Exception(`Unable to publish the content for id: ${contentID}`, err);
        }
    }

    async unPublishContent (contentID: number, guid: string, locale: string,comments: string = null ){
        try{
            let apiPath = `${locale}/item/${contentID}/unpublish?comments=${comments}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            let batchID = resp.data as number;
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID, guid));
            let contentIDs: number[]= [];

            batch.items.forEach(element => contentIDs.push(element.itemID));
            return contentIDs;
        } catch(err){
            throw new Exception(`Unable to un-publish the content for id: ${contentID}`, err);
        }
    }

    async contentRequestApproval (contentID: number, guid: string, locale: string ,comments: string = null  ){
        try{
            let apiPath = `${locale}/item/${contentID}/request-approval?comments=${comments}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            let batchID = resp.data as number;
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID, guid));
            let contentIDs: number[]= [];

            batch.items.forEach(element => contentIDs.push(element.itemID));
            return contentIDs;
        } catch(err){
            throw new Exception(`Unable to request approval the content for id: ${contentID}`, err);
        }
    }

    async approveContent (contentID: number, guid: string, locale: string,comments: string = null ){
        try{
            let apiPath = `${locale}/item/${contentID}/approve?comments=${comments}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            let batchID = resp.data as number;
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID, guid));
            let contentIDs: number[]= [];

            batch.items.forEach(element => contentIDs.push(element.itemID));
            return contentIDs;
        } catch(err){
            throw new Exception(`Unable to approve the content for id: ${contentID}`, err);
        }
    }

    async declineContent (contentID: number, guid: string, locale: string,comments: string = null ){
        try{
            let apiPath = `${locale}/item/${contentID}/decline?comments=${comments}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            let batchID = resp.data as number;
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID, guid));
            let contentIDs: number[]= [];

            batch.items.forEach(element => contentIDs.push(element.itemID));
            return contentIDs;
        } catch(err){
            throw new Exception(`Unable to decline the content for id: ${contentID}`, err);
        }
    }

    async deleteContent (contentID: number, guid: string, locale: string,comments: string = null ){
        try{
            let apiPath = `${locale}/item/${contentID}?comments=${comments}`;
            const resp = await this._clientInstance.executeDelete(apiPath, guid, this._options.token);

            let batchID = resp.data as number;
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID, guid));
            let contentIDs: number[]= [];

            batch.items.forEach(element => contentIDs.push(element.itemID));
            return contentIDs;
        } catch(err){
            throw new Exception(`Unable to delete the content for id: ${contentID}`, err);
        }
    }

    async saveContentItem(contentItem: ContentItem, guid: string, locale: string){
        try{
            let apiPath = `${locale}/item`;
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, contentItem);

            let batchID = resp.data as number;
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID, guid));
            let contentIDs: number[]= [];

            batch.items.forEach(element => contentIDs.push(element.itemID));
            return contentIDs;
        } catch(err){
            throw new Exception('Unable to create content.', err);
        }
    }

    async saveContentItems(contentItems: ContentItem[], guid: string, locale: string){
        try{
            let apiPath = `${locale}/item/multi`;
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, contentItems);

            let batchID = resp.data as number;
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID, guid));
            let contentIDs: number[]= [];

            batch.items.forEach(element => contentIDs.push(element.itemID));
            return contentIDs;
        } catch(err){
            throw new Exception('Unable to create contents.', err);
        }
    }

    async getContentItems(referenceName: string, guid: string, locale: string, filter: string = '', fields: string = null,
        sortDirection: string = null, sortField: string = null,
        take: number = 50, skip: number = 0){
            try{
                let apiPath = `${locale}/list/${referenceName}?filter=${filter}&fields=${fields}&sortDirection=${sortDirection}&sortField=${sortField}&take=${take}&skip=${skip}`;
                const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

                return resp.data as ContentList;
            } catch(err) {
                throw new Exception(`Unable retreive the content details for reference name: ${referenceName}`, err);
            }
        }
}