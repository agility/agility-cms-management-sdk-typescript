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
        this._clientInstance = new ClientInstance();
        this._batchMethods = new BatchMethods(this._options);
    }

   async getContentItem(contentID: number){
        try{
            let apiPath = `${this._options.locale}/item/${contentID}`;
            const resp = await this._clientInstance.executeGet(apiPath, this._options);

            return resp.data as ContentItem;
        } catch(err){
            throw new Exception(`Unable to retreive the content for id: ${contentID}`, err);
        }
    }

     async publishContent (contentID: number,comments: string = null ){
        try{
            let apiPath = `${this._options.locale}/item/${contentID}/publish?comments=${comments}`;
            const resp = await this._clientInstance.executeGet(apiPath, this._options);

            let batchID = resp.data as number;
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID));
            let contentIDs: number[]= [];

            batch.items.forEach(element => contentIDs.push(element.itemID));
            return contentIDs;
        } catch(err){
            throw new Exception(`Unable to publish the content for id: ${contentID}`, err);
        }
    }

    async unPublishContent (contentID: number,comments: string = null ){
        try{
            let apiPath = `${this._options.locale}/item/${contentID}/unpublish?comments=${comments}`;
            const resp = await this._clientInstance.executeGet(apiPath, this._options);

            let batchID = resp.data as number;
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID));
            let contentIDs: number[]= [];
  
            batch.items.forEach(element => contentIDs.push(element.itemID));
            return contentIDs;
        } catch(err){
            throw new Exception(`Unable to un-publish the content for id: ${contentID}`, err);
        }
    }

    async contentRequestApproval (contentID: number,comments: string = null  ){
        try{
            let apiPath = `${this._options.locale}/item/${contentID}/request-approval?comments=${comments}`;
            const resp = await this._clientInstance.executeGet(apiPath, this._options);

            let batchID = resp.data as number;
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID));
            let contentIDs: number[]= [];
  
            batch.items.forEach(element => contentIDs.push(element.itemID));
            return contentIDs;
        } catch(err){
            throw new Exception(`Unable to request approval the content for id: ${contentID}`, err);
        }
    }

    async approveContent (contentID: number,comments: string = null ){
        try{
            let apiPath = `${this._options.locale}/item/${contentID}/approve?comments=${comments}`;
            const resp = await this._clientInstance.executeGet(apiPath, this._options);

            let batchID = resp.data as number;
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID));
            let contentIDs: number[]= [];
  
            batch.items.forEach(element => contentIDs.push(element.itemID));
            return contentIDs;
        } catch(err){
            throw new Exception(`Unable to approve the content for id: ${contentID}`, err);
        }
    }

    async declineContent (contentID: number,comments: string = null ){
        try{
            let apiPath = `${this._options.locale}/item/${contentID}/decline?comments=${comments}`;
            const resp = await this._clientInstance.executeGet(apiPath, this._options);

            let batchID = resp.data as number;
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID));
            let contentIDs: number[]= [];
  
            batch.items.forEach(element => contentIDs.push(element.itemID));
            return contentIDs;
        } catch(err){
            throw new Exception(`Unable to decline the content for id: ${contentID}`, err);
        }
    }

    async deleteContent (contentID: number,comments: string = null ){
        try{
            let apiPath = `${this._options.locale}/item/${contentID}?comments=${comments}`;
            const resp = await this._clientInstance.executeDelete(apiPath, this._options);

            let batchID = resp.data as number;
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID));
            let contentIDs: number[]= [];
  
            batch.items.forEach(element => contentIDs.push(element.itemID));
            return contentIDs;
        } catch(err){
            throw new Exception(`Unable to delete the content for id: ${contentID}`, err);
        }
    }

    async saveContentItem(contentItem: ContentItem){
        try{
            let apiPath = `${this._options.locale}/item`;
            const resp = await this._clientInstance.executePost(apiPath, this._options, contentItem);

            let batchID = resp.data as number;
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID));
            let contentIDs: number[]= [];
  
            batch.items.forEach(element => contentIDs.push(element.itemID));
            return contentIDs;
        } catch(err){
            throw new Exception('Unable to create content.', err);
        }
    }

    async saveContentItems(contentItems: ContentItem[]){
        try{
            let apiPath = `${this._options.locale}/item/multi`;
            const resp = await this._clientInstance.executePost(apiPath, this._options, contentItems);
              
            let batchID = resp.data as number;
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID));
            let contentIDs: number[]= [];
  
            batch.items.forEach(element => contentIDs.push(element.itemID));
            return contentIDs;
        } catch(err){
            throw new Exception('Unable to create contents.', err);
        }
    }

    async getContentItems(referenceName: string, filter: string = '', fields: string = null, 
        sortDirection: string = null, sortField: string = null,
        take: number = 50, skip: number = 0){
            try{
                let apiPath = `${this._options.locale}/list/${referenceName}?filter=${filter}&fields=${fields}&sortDirection=${sortDirection}&sortField=${sortField}&take=${take}&skip=${skip}`;
                const resp = await this._clientInstance.executeGet(apiPath, this._options);

                return resp.data as ContentList;
            } catch(err) {
                throw new Exception(`Unable retreive the content details for reference name: ${referenceName}`, err);
            }
        }
}