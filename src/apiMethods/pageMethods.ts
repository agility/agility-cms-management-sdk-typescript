import { Options } from "../models/options";
import { ClientInstance } from "./clientInstance";
import { PageItem } from "../models/pageItem";
import { Sitemap } from "../models/sitemap";
import { BatchMethods } from "./batchMethods";

export class PageMethods{
    _options!: Options;
    _clientInstance!: ClientInstance;
    _batchMethods: BatchMethods;

    constructor(options: Options){
        this._options = options;
        this._clientInstance = new ClientInstance();
        this._batchMethods = new BatchMethods(this._options);
    }

    async getSitemap(){
        try{
            let apiPath = `${this._options.locale}/sitemap`;
            const resp = await this._clientInstance.executeGet(apiPath, this._options);

            return resp.data as Sitemap[];
        } catch(err){
            throw `Unable to retreive sitemap.`;
        }
    }

    async getPage(pageID: number){
        try{
            let apiPath = `${this._options.locale}/page/${pageID}`;
            const resp = await this._clientInstance.executeGet(apiPath, this._options);

            return resp.data as PageItem;
        } catch(err){
            throw `Unable to retreive page for id ${pageID}.`;
        }
    }

    async publishPage (pageID: number,comments: string = null){
        try{
            let apiPath = `${this._options.locale}/page/${pageID}/publish?comments=${comments}`;
            const resp = await this._clientInstance.executeGet(apiPath, this._options);

            let batchID = resp.data as number;
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID));
            let pageIDs: number[]= [];
  
            batch.items.forEach(element => pageIDs.push(element.itemID));
            return pageIDs;
        } catch(err){
            throw `Unable to publish the page for id: ${pageID}`;
        }
    }

    async unPublishPage (pageID: number,comments: string = null){
        try{
            let apiPath = `${this._options.locale}/page/${pageID}/unpublish?comments=${comments}`;
            const resp = await this._clientInstance.executeGet(apiPath, this._options);

            let batchID = resp.data as number;
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID));
            let pageIDs: number[]= [];
  
            batch.items.forEach(element => pageIDs.push(element.itemID));
            return pageIDs;
        } catch(err){
            throw `Unable to un-publish the page for id: ${pageID}`;
        }
    }

    async pageRequestApproval (pageID: number,comments: string = null){
        try{
            let apiPath = `${this._options.locale}/page/${pageID}/request-approval?comments=${comments}`;
            const resp = await this._clientInstance.executeGet(apiPath, this._options);

            let batchID = resp.data as number;
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID));
            let pageIDs: number[]= [];
  
            batch.items.forEach(element => pageIDs.push(element.itemID));
            return pageIDs;
        } catch(err){
            throw `Unable to request approval the page for id: ${pageID}`;
        }
    }

    async approvePage (pageID: number,comments: string = null){
        try{
            let apiPath = `${this._options.locale}/page/${pageID}/approve?comments=${comments}`;
            const resp = await this._clientInstance.executeGet(apiPath, this._options);

            let batchID = resp.data as number;
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID));
            let pageIDs: number[]= [];
  
            batch.items.forEach(element => pageIDs.push(element.itemID));
            return pageIDs;
        } catch(err){
            throw `Unable to approve the page for id: ${pageID}`;
        }
    }

    async declinePage (pageID: number,comments: string = null){
        try{
            let apiPath = `${this._options.locale}/page/${pageID}/decline?comments=${comments}`;
            const resp = await this._clientInstance.executeGet(apiPath, this._options);

            let batchID = resp.data as number;
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID));
            let pageIDs: number[]= [];
  
            batch.items.forEach(element => pageIDs.push(element.itemID));
            return pageIDs;
        } catch(err){
            throw `Unable to decline the page for id: ${pageID}`;
        }
    }

    async deletePage (pageID: number,comments: string = null){
        try{
            let apiPath = `${this._options.locale}/page/${pageID}?comments=${comments}`;
            const resp = await this._clientInstance.executeDelete(apiPath, this._options);

              let batchID = resp.data as number;
              var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID));
              let pageIDs: number[]= [];
  
              batch.items.forEach(element => pageIDs.push(element.itemID));
              return pageIDs;
        } catch(err){
            throw `Unable to delete the page for id: ${pageID}`;
        }
    }

    async savePage(pageItem: PageItem, parentPageID: number = -1, placeBeforePageItemID: number = -1){
        try{
            let apiPath = `${this._options.locale}/page?parentPageID=${parentPageID}&placeBeforePageItemID=${placeBeforePageItemID}`;
            const resp = await this._clientInstance.executePost(apiPath, this._options, pageItem);

              let batchID = resp.data as number;
              var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID));
              let pageIDs: number[]= [];
  
              batch.items.forEach(element => pageIDs.push(element.itemID));
              return pageIDs;
        } catch(err){
            throw `Unable to create page. ${err}`;
        }
    }
}