import { Options } from "../models/options";
import { ClientInstance } from "./clientInstance";
import { ContentItem } from "../models/contentItem";
import { BatchMethods } from "./batchMethods";

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
            throw `Unable to retreive the content for id: ${contentID}`;
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
            throw `Unable to publish the content for id: ${contentID}`;
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
            throw `Unable to un-publish the content for id: ${contentID}`;
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
            throw `Unable to request approval the content for id: ${contentID}`;
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
            throw `Unable to approve the content for id: ${contentID}`;
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
            throw `Unable to decline the content for id: ${contentID}`;
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
            throw `Unable to delete the content for id: ${contentID}`;
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
            throw 'Unable to create content.';
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
            throw 'Unable to create contents.';
        }
    }
}