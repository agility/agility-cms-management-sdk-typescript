import { Options } from "../models/options";
import { ClientInstance } from "./clientInstance";
import { PageItem } from "../models/pageItem";
import { Sitemap } from "../models/sitemap";
import { BatchMethods } from "./batchMethods";
import { Exception } from "../models/exception";
import { PageModel } from "../models/pageModel";
import { ContentSectionDefinition } from "../models/contentSectionDefinition";

export class PageMethods{
    _options!: Options;
    _clientInstance!: ClientInstance;
    _batchMethods: BatchMethods;

    constructor(options: Options){
        this._options = options;
        this._clientInstance = new ClientInstance(this._options);
        this._batchMethods = new BatchMethods(this._options);
    }

    async getSitemap(guid: string, locale: string){
        try{
            let apiPath = `${locale}/sitemap`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as Sitemap[];
        } catch(err){
            throw new Exception(`Unable to retreive sitemap.`, err);
        }
    }

    async getPageTemplates(guid: string, locale: string, includeModuleZones: boolean, searchFilter: string = null){
        try{
            if(!searchFilter) searchFilter = '';
            let apiPath = `${locale}/page/templates?includeModuleZones=${includeModuleZones}&searchFilter=${searchFilter}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as PageModel[];
        } catch(err){
            throw new Exception(`Unable to retreive Page Templates.`, err);
        }
    }

    async getPageTemplate(guid: string, locale: string, pageTemplateId: number){
        try{
            let apiPath = `${locale}/page/template/${pageTemplateId}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as PageModel;
        } catch(err){
            throw new Exception(`Unable to retreive Page Template.`, err);
        }
    }

    async getPageTemplateName(guid: string, locale: string, templateName: string){
        try{
            let apiPath = `${locale}/page/template/${templateName}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as PageModel;
        } catch(err){
            throw new Exception(`Unable to retreive Page Template.`, err);
        }
    }

    async deletePageTemplate(guid: string, locale: string, pageTemplateId: number){
        try{
            let apiPath = `${locale}/page/template/${pageTemplateId}`;

            const resp = await this._clientInstance.executeDelete(apiPath, guid, this._options.token);

            return resp.data as string;
        } catch(err){
            throw new Exception(`Unable to delete Page Template.`, err);
        }
    }

    async getPageItemTemplates(guid: string, locale: string, id: number){
        try{
            let apiPath = `${locale}/page/template/items/${id}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as ContentSectionDefinition[];
        } catch(err){
            throw new Exception(`Unable to retreive Page Template Items.`, err);
        }
    }

    async savePageTemplate(guid: string, locale: string, pageModel: PageModel){
        try{
            let apiPath = `${locale}/page/template`;
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, pageModel);

            return resp.data as PageModel;
        } catch(err){
            throw new Exception(`Unable to save Page Template.`, err);
        }
    }

    async getPage(pageID: number, guid: string, locale: string){
        try{
            let apiPath = `${locale}/page/${pageID}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as PageItem;
        } catch(err){
            throw new Exception(`Unable to retreive page for id ${pageID}.`, err);
        }
    }

    async publishPage (pageID: number, guid: string, locale: string, comments: string = null){
        try{
            let apiPath = `${locale}/page/${pageID}/publish?comments=${comments}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            let batchID = resp.data as number;
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID, guid));
            let pageIDs: number[]= [];
  
            batch.items.forEach(element => pageIDs.push(element.itemID));
            return pageIDs;
        } catch(err){
            throw new Exception(`Unable to publish the page for id: ${pageID}`, err);
        }
    }

    async unPublishPage (pageID: number, guid: string, locale: string,comments: string = null){
        try{
            let apiPath = `${locale}/page/${pageID}/unpublish?comments=${comments}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            let batchID = resp.data as number;
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID, guid));
            let pageIDs: number[]= [];
  
            batch.items.forEach(element => pageIDs.push(element.itemID));
            return pageIDs;
        } catch(err){
            throw new Exception(`Unable to un-publish the page for id: ${pageID}`, err);
        }
    }

    async pageRequestApproval (pageID: number, guid: string, locale: string,comments: string = null){
        try{
            let apiPath = `${locale}/page/${pageID}/request-approval?comments=${comments}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            let batchID = resp.data as number;
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID, guid));
            let pageIDs: number[]= [];
  
            batch.items.forEach(element => pageIDs.push(element.itemID));
            return pageIDs;
        } catch(err){
            throw new Exception(`Unable to request approval the page for id: ${pageID}`, err);
        }
    }

    async approvePage (pageID: number, guid: string, locale: string,comments: string = null){
        try{
            let apiPath = `${locale}/page/${pageID}/approve?comments=${comments}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            let batchID = resp.data as number;
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID, guid));
            let pageIDs: number[]= [];
  
            batch.items.forEach(element => pageIDs.push(element.itemID));
            return pageIDs;
        } catch(err){
            throw new Exception(`Unable to approve the page for id: ${pageID}`, err);
        }
    }

    async declinePage (pageID: number, guid: string, locale: string,comments: string = null){
        try{
            let apiPath = `${locale}/page/${pageID}/decline?comments=${comments}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            let batchID = resp.data as number;
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID, guid));
            let pageIDs: number[]= [];
  
            batch.items.forEach(element => pageIDs.push(element.itemID));
            return pageIDs;
        } catch(err){
            throw new Exception(`Unable to decline the page for id: ${pageID}`, err);
        }
    }

    async deletePage (pageID: number, guid: string, locale: string,comments: string = null){
        try{
            let apiPath = `${locale}/page/${pageID}?comments=${comments}`;
            const resp = await this._clientInstance.executeDelete(apiPath, guid, this._options.token);

              let batchID = resp.data as number;
              var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID, guid));
              let pageIDs: number[]= [];
  
              batch.items.forEach(element => pageIDs.push(element.itemID));
              return pageIDs;
        } catch(err){
            throw new Exception(`Unable to delete the page for id: ${pageID}`, err);
        }
    }

    async savePage(pageItem: PageItem, guid: string, locale: string, parentPageID: number = -1, placeBeforePageItemID: number = -1){
        try{
            let apiPath = `${locale}/page?parentPageID=${parentPageID}&placeBeforePageItemID=${placeBeforePageItemID}`;
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, pageItem);

              let batchID = resp.data as number;
              var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID, guid));
              let pageIDs: number[]= [];
  
              batch.items.forEach(element => pageIDs.push(element.itemID));
              return pageIDs;
        } catch(err){
            throw new Exception(`Unable to create page. ${err}`, err);
        }
    }
}