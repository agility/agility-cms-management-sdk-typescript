import { Options } from "../types/options";
import { ClientInstance } from "./clientInstance";
import { PageItem } from "../types/pageItem";
import { Sitemap } from "../types/sitemap";
import { BatchMethods } from "./batchMethods";
import { Exception } from "../errors/exception";
import { PageModel } from "../types/pageModel";
import { ContentSectionDefinition } from "../types/contentSectionDefinition";
import { PageHistory } from "../types/pageHistory";
import { ItemComments } from "../types/itemComments";
import { Batch } from "../types/batch";
// import { DeleteResponse } from "../types/apiResponse";

export class PageMethods{
    _options!: Options;
    _clientInstance!: ClientInstance;
    _batchMethods: BatchMethods;

    constructor(options: Options){
        this._options = options;
        this._clientInstance = new ClientInstance(this._options);
        this._batchMethods = new BatchMethods(this._options);
    }

    /**
     * Retrieves the sitemap structure for a given locale.
     * @param guid The instance GUID.
     * @param locale The locale code.
     * @returns A promise resolving to an array of Sitemap node objects.
     */
    async getSitemap(guid: string, locale: string): Promise<Sitemap[]> {
        try{
            let apiPath = `${locale}/sitemap`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            if (!Array.isArray(resp)) { throw new Error("Invalid response structure for Sitemap list."); }
            return resp as Sitemap[];
        } catch(err: any){
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to retrieve sitemap.`, error);
        }
    }

    /**
     * Retrieves available page templates.
     * @param guid The instance GUID.
     * @param locale The locale code.
     * @param includeModuleZones Whether to include module zone details.
     * @param searchFilter Optional filter string for template names.
     * @returns A promise resolving to an array of PageModel objects.
     */
    async getPageTemplates(guid: string, locale: string, includeModuleZones: boolean, searchFilter?: string): Promise<PageModel[]> {
        try{
            if(!searchFilter) searchFilter = '';
            let apiPath = `${locale}/page/templates?includeModuleZones=${includeModuleZones}&searchFilter=${searchFilter}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            if (!Array.isArray(resp)) { throw new Error("Invalid response structure for PageModel list."); }
            return resp as PageModel[];
        } catch(err: any){
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to retrieve Page Templates.`, error);
        }
    }

    /**
     * Retrieves a specific page template by its ID.
     * @param guid The instance GUID.
     * @param locale The locale code.
     * @param pageTemplateId The numeric ID of the page template.
     * @returns A promise resolving to the PageModel object.
     */
    async getPageTemplate(guid: string, locale: string, pageTemplateId: number): Promise<PageModel> {
        try{
            let apiPath = `${locale}/page/template/${pageTemplateId}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            if (!resp?.id) { throw new Error("Invalid response structure for PageModel."); }
            return resp as PageModel;
        } catch(err: any){
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to retrieve Page Template.`, error);
        }
    }

    /**
     * Retrieves a specific page template by its name.
     * @param guid The instance GUID.
     * @param locale The locale code.
     * @param templateName The name of the page template.
     * @returns A promise resolving to the PageModel object.
     */
    async getPageTemplateName(guid: string, locale: string, templateName: string): Promise<PageModel> {
        try{
            let apiPath = `${locale}/page/template/${templateName}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            if (!resp?.id) { throw new Error("Invalid response structure for PageModel."); }
            return resp as PageModel;
        } catch(err: any){
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to retrieve Page Template.`, error);
        }
    }

    /**
     * Deletes a specific page template. Assumed synchronous.
     * @param guid The instance GUID.
     * @param locale The locale code.
     * @param pageTemplateId The numeric ID of the page template to delete.
     * @returns A promise resolving when the deletion is complete.
     */
    async deletePageTemplate(guid: string, locale: string, pageTemplateId: number): Promise<void> {
        try{
            let apiPath = `${locale}/page/template/${pageTemplateId}`;

            await this._clientInstance.executeDelete(apiPath, guid, this._options.token);
        } catch(err: any){
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to delete Page Template.`, error);
        }
    }

    /**
     * Retrieves the item templates (content section definitions) for a specific page template.
     * @param guid The instance GUID.
     * @param locale The locale code.
     * @param id The ID of the page template.
     * @returns A promise resolving to an array of ContentSectionDefinition objects.
     */
    async getPageItemTemplates(guid: string, locale: string, id: number): Promise<ContentSectionDefinition[]> {
        try{
            let apiPath = `${locale}/page/template/items/${id}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            if (!Array.isArray(resp)) {
                throw new Error("Invalid response structure for ContentSectionDefinition list.");
            }
            return resp as ContentSectionDefinition[];
        } catch(err: any){
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to retrieve Page Template Items.`, error);
        }
    }

    /**
     * Saves (creates or updates) a page template. Assumed synchronous.
     * @param guid The instance GUID.
     * @param locale The locale code.
     * @param pageModel The PageModel object to save.
     * @returns A promise resolving to the saved PageModel object.
     */
    async savePageTemplate(guid: string, locale: string, pageModel: PageModel): Promise<PageModel> {
        try{
            let apiPath = `${locale}/page/template`;
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, pageModel);

            if (!resp?.id) {
                throw new Error("Invalid response structure for saved PageModel.");
            }
            return resp as PageModel;
        } catch(err: any){
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to save Page Template.`, error);
        }
    }

    /**
     * Retrieves a specific page by its ID.
     * @param pageID The numeric ID of the page.
     * @param guid The instance GUID.
     * @param locale The locale code.
     * @returns A promise resolving to the PageItem object.
     */
    async getPage(pageID: number, guid: string, locale: string): Promise<PageItem> {
        try{
            let apiPath = `${locale}/page/${pageID}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            if (!resp?.pageID) {
                throw new Error("Invalid response structure for PageItem.");
            }
            return resp as PageItem;
        } catch(err: any){
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to retrieve page for id ${pageID}.`, error);
        }
    }

    /**
     * Publishes a page. This is a batch operation.
     * @param pageID The ID of the page to publish.
     * @param guid The instance GUID.
     * @param locale The locale code.
     * @param comments Optional comments.
     * @returns A promise resolving to the final Batch object.
     */
    async publishPage(pageID: number, guid: string, locale: string, comments?: string): Promise<Batch> {
        try{
            const commentsParam = comments ? `?comments=${encodeURIComponent(comments)}` : '';
            let apiPath = `${locale}/page/${pageID}/publish${commentsParam}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            let batchID = -1;
            if (typeof resp === 'number') {
                batchID = resp;
            } else if (typeof resp?.data === 'number') {
                batchID = resp.data;
            } else {
                throw new Error(`Publish page for id ${pageID} did not return a valid batch ID number.`);
            }
            return await this._batchMethods.Retry(async () => this._batchMethods.getBatch(batchID, guid));
        } catch(err: any){
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to publish the page for id: ${pageID}`, error);
        }
    }

    /**
     * Un-publishes a page. This is a batch operation.
     * @param pageID The ID of the page to un-publish.
     * @param guid The instance GUID.
     * @param locale The locale code.
     * @param comments Optional comments.
     * @returns A promise resolving to the final Batch object.
     */
    async unPublishPage(pageID: number, guid: string, locale: string, comments?: string): Promise<Batch> {
        try{
            const commentsParam = comments ? `?comments=${encodeURIComponent(comments)}` : '';
            let apiPath = `${locale}/page/${pageID}/unpublish${commentsParam}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);
            let batchID = -1;
            if (typeof resp === 'number') { batchID = resp; }
            else if (typeof resp?.data === 'number') { batchID = resp.data; }
            else { throw new Error(`Unpublish page for id ${pageID} did not return a valid batch ID number.`); }
            return await this._batchMethods.Retry(async () => this._batchMethods.getBatch(batchID, guid));
        } catch(err: any){
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to un-publish the page for id: ${pageID}`, error);
        }
    }

    /**
     * Requests approval for a page. This is a batch operation.
     * @param pageID The ID of the page.
     * @param guid The instance GUID.
     * @param locale The locale code.
     * @param comments Optional comments.
     * @returns A promise resolving to the final Batch object.
     */
    async pageRequestApproval(pageID: number, guid: string, locale: string, comments?: string): Promise<Batch> {
        try{
            const commentsParam = comments ? `?comments=${encodeURIComponent(comments)}` : '';
            let apiPath = `${locale}/page/${pageID}/request-approval${commentsParam}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);
            let batchID = -1;
            if (typeof resp === 'number') { batchID = resp; }
            else if (typeof resp?.data === 'number') { batchID = resp.data; }
            else { throw new Error(`Request approval for page id ${pageID} did not return a valid batch ID number.`); }
            return await this._batchMethods.Retry(async () => this._batchMethods.getBatch(batchID, guid));
        } catch(err: any){
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to request approval the page for id: ${pageID}`, error);
        }
    }

    /**
     * Approves a page. This is a batch operation.
     * @param pageID The ID of the page.
     * @param guid The instance GUID.
     * @param locale The locale code.
     * @param comments Optional comments.
     * @returns A promise resolving to the final Batch object.
     */
    async approvePage(pageID: number, guid: string, locale: string, comments?: string): Promise<Batch> {
        try{
            const commentsParam = comments ? `?comments=${encodeURIComponent(comments)}` : '';
            let apiPath = `${locale}/page/${pageID}/approve${commentsParam}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);
             let batchID = -1;
             if (typeof resp === 'number') { batchID = resp; }
             else if (typeof resp?.data === 'number') { batchID = resp.data; }
             else { throw new Error(`Approve page for id ${pageID} did not return a valid batch ID number.`); }
            return await this._batchMethods.Retry(async () => this._batchMethods.getBatch(batchID, guid));
        } catch(err: any){
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to approve the page for id: ${pageID}`, error);
        }
    }

    /**
     * Declines a page. This is a batch operation.
     * @param pageID The ID of the page.
     * @param guid The instance GUID.
     * @param locale The locale code.
     * @param comments Optional comments.
     * @returns A promise resolving to the final Batch object.
     */
    async declinePage(pageID: number, guid: string, locale: string, comments?: string): Promise<Batch> {
        try{
            const commentsParam = comments ? `?comments=${encodeURIComponent(comments)}` : '';
            let apiPath = `${locale}/page/${pageID}/decline${commentsParam}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);
            let batchID = -1;
            if (typeof resp === 'number') { batchID = resp; }
            else if (typeof resp?.data === 'number') { batchID = resp.data; }
            else { throw new Error(`Decline page for id ${pageID} did not return a valid batch ID number.`); }
            return await this._batchMethods.Retry(async () => this._batchMethods.getBatch(batchID, guid));
        } catch(err: any){
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to decline the page for id: ${pageID}`, error);
        }
    }

    /**
     * Deletes a page. This is a batch operation.
     * @param pageID The ID of the page to delete.
     * @param guid The instance GUID.
     * @param locale The locale code.
     * @param comments Optional comments.
     * @returns A promise resolving to the final Batch object.
     */
    async deletePage(pageID: number, guid: string, locale: string, comments?: string): Promise<Batch> {
        try {
            const commentsParam = comments ? `?comments=${encodeURIComponent(comments)}` : '';
            let apiPath = `${locale}/page/${pageID}${commentsParam}`;
            const resp = await this._clientInstance.executeDelete(apiPath, guid, this._options.token);

            let batchID = -1;
            if (typeof resp === 'object' && resp !== null && typeof resp.batchID === 'number') {
                batchID = resp.batchID;
            } else if (typeof resp === 'number') {
                batchID = resp;
            } else {
                throw new Error(`Delete page for id ${pageID} did not return a valid batch ID number or Batch object.`);
            }
            return await this._batchMethods.Retry(async () => this._batchMethods.getBatch(batchID, guid));
        } catch (err: any) {
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to delete the page for id: ${pageID}`, error);
        }
    }

    /**
     * Saves (creates or updates) a page. This is a batch operation.
     * @param pageItem The PageItem object to save.
     * @param guid The instance GUID.
     * @param locale The locale code.
     * @param parentPageID Optional parent page ID for positioning.
     * @param placeBeforePageItemID Optional sibling page ID for positioning.
     * @returns A promise resolving to the final Batch object.
     */
    async savePage(pageItem: PageItem, guid: string, locale: string, parentPageID: number = -1, placeBeforePageItemID: number = -1): Promise<Batch> {
        try {
            let apiPath = `${locale}/page?parentPageID=${parentPageID}&placeBeforePageItemID=${placeBeforePageItemID}`;
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, pageItem);

            let batchID = -1;
            if (typeof resp === 'number') { batchID = resp; }
            else if (typeof resp?.data === 'number') { batchID = resp.data; }
            else { throw new Error(`Save page did not return a valid batch ID number.`); }
            return await this._batchMethods.Retry(async () => this._batchMethods.getBatch(batchID, guid));
        } catch (err: any) {
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to create page. ${error.message}`, error);
        }
    }

    /**
     * Retrieves the history of changes for a specific page.
     * @param locale The locale code.
     * @param guid The instance GUID.
     * @param pageID The ID of the page.
     * @param take Max number of history records (default 50).
     * @param skip Number of records to skip (default 0).
     * @returns A promise resolving to a PageHistory object.
     */
    async getPageHistory(locale: string, guid: string, pageID: number, take: number = 50, skip: number = 0): Promise<PageHistory> {
        try {
            let apiPath = `${locale}/item/${pageID}/history?take=${take}&skip=${skip}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            if (!Array.isArray(resp?.history)) {
                throw new Error("Invalid response structure for PageHistory.");
            }
            return resp as PageHistory;
        } catch (err: any) {
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to retrieve history for pageID: ${pageID}`, error)
        }
    }

    /**
     * Retrieves the comments for a specific page.
     * @param locale The locale code.
     * @param guid The instance GUID.
     * @param pageID The ID of the page.
     * @param take Max number of comments (default 50).
     * @param skip Number of comments to skip (default 0).
     * @returns A promise resolving to an ItemComments object.
     */
    async getPageComments(locale: string, guid: string, pageID: number, take: number = 50, skip: number = 0): Promise<ItemComments> {
        try {
            let apiPath = `${locale}/page/${pageID}/comments?take=${take}&skip=${skip}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            if (!Array.isArray(resp?.comments)) {
                throw new Error("Invalid response structure for ItemComments.");
            }
            return resp as ItemComments;
        } catch (err: any) {
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to retrieve comments for pageID: ${pageID}`, error)
        }
    }
}