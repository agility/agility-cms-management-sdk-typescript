import { Options } from "../models/options";
import { ClientInstance } from "./clientInstance";
import { PageItem } from "../models/pageItem";
import { Sitemap } from "../models/sitemap";
import { BatchMethods } from "./batchMethods";
import { Exception } from "../models/exception";
import { PageModel } from "../models/pageModel";
import { ContentSectionDefinition } from "../models/contentSectionDefinition";
import { PageHistory } from "../models/pageHistory";
import { ItemComments } from "../models/itemComments";
import { BatchState } from "../enums/batchState.";
import { WorkflowOperationType } from "../enums/workflowOperationType";

export class PageMethods {
    _options!: Options;
    _clientInstance!: ClientInstance;
    _batchMethods: BatchMethods;

    constructor(options: Options) {
        this._options = options;
        this._clientInstance = new ClientInstance(this._options);
        this._batchMethods = new BatchMethods(this._options);
    }

    async getSitemap(guid: string, locale: string) {
        try {
            let apiPath = `${locale}/sitemap`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as Sitemap[];
        } catch (err) {
            throw new Exception(`Unable to retrieve sitemap.`, err);
        }
    }

    async getPageTemplates(guid: string, locale: string, includeModuleZones: boolean, searchFilter: string = null) {
        try {
            if (!searchFilter) searchFilter = '';
            let apiPath = `${locale}/page/templates?includeModuleZones=${includeModuleZones}&searchFilter=${searchFilter}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as PageModel[];
        } catch (err) {
            throw new Exception(`Unable to retrieve Page Templates.`, err);
        }
    }

    async getPageTemplate(guid: string, locale: string, pageTemplateId: number) {
        try {
            let apiPath = `${locale}/page/template/${pageTemplateId}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as PageModel;
        } catch (err) {
            throw new Exception(`Unable to retrieve Page Template.`, err);
        }
    }

    async getPageTemplateName(guid: string, locale: string, templateName: string) {
        try {
            let apiPath = `${locale}/page/template/${templateName}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as PageModel;
        } catch (err) {
            throw new Exception(`Unable to retrieve Page Template.`, err);
        }
    }

    async deletePageTemplate(guid: string, locale: string, pageTemplateId: number) {
        try {
            let apiPath = `${locale}/page/template/${pageTemplateId}`;

            const resp = await this._clientInstance.executeDelete(apiPath, guid, this._options.token);

            return resp.data as string;
        } catch (err) {
            throw new Exception(`Unable to delete Page Template.`, err);
        }
    }

    async getPageItemTemplates(guid: string, locale: string, id: number) {
        try {
            let apiPath = `${locale}/page/template/items/${id}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as ContentSectionDefinition[];
        } catch (err) {
            throw new Exception(`Unable to retrieve Page Template Items.`, err);
        }
    }

    async savePageTemplate(guid: string, locale: string, pageModel: PageModel) {
        try {
            let apiPath = `${locale}/page/template`;
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, pageModel);

            return resp.data as PageModel;
        } catch (err) {
            throw new Exception(`Unable to save Page Template.`, err);
        }
    }

    async getPage(pageID: number, guid: string, locale: string) {
        try {
            let apiPath = `${locale}/page/${pageID}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as PageItem;
        } catch (err) {
            throw new Exception(`Unable to retrieve page for id ${pageID}.`, err);
        }
    }

    async publishPage(pageID: number, guid: string, locale: string, comments: string = null, returnBatchId: boolean = false): Promise<number[]> {
        try {
            let apiPath = `${locale}/page/${pageID}/publish?comments=${comments}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            let batchID = resp.data as number;

            // If user wants batchID immediately, return it for custom polling
            if (returnBatchId) {
                return [batchID];
            }

            // Default behavior: wait for completion and return IDs
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID, guid));
            let pageIDs: number[] = [];

            batch.items.forEach(element => pageIDs.push(element.itemID));
            return pageIDs;
        } catch (err) {
            throw new Exception(`Unable to publish the page for id: ${pageID}`, err);
        }
    }

    async unPublishPage(pageID: number, guid: string, locale: string, comments: string = null, returnBatchId: boolean = false): Promise<number[]> {
        try {
            let apiPath = `${locale}/page/${pageID}/unpublish?comments=${comments}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            let batchID = resp.data as number;

            // If user wants batchID immediately, return it for custom polling
            if (returnBatchId) {
                return [batchID];
            }

            // Default behavior: wait for completion and return IDs
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID, guid));
            let pageIDs: number[] = [];

            batch.items.forEach(element => pageIDs.push(element.itemID));
            return pageIDs;
        } catch (err) {
            throw new Exception(`Unable to un-publish the page for id: ${pageID}`, err);
        }
    }

    /**
     * Perform a batch workflow operation on multiple pages.
     * Supports Publish, Unpublish, Approve, Decline, and RequestApproval operations.
     * @param pageIDs Array of page IDs to process
     * @param guid The GUID of the user making the request
     * @param locale The locale of the pages
     * @param operation The workflow operation type (Publish, Unpublish, Approve, Decline, RequestApproval)
     * @param returnBatchId Whether to return the batch ID immediately
     * @returns The IDs of the processed pages
     */
    async batchWorkflowPages(pageIDs: number[], guid: string, locale: string, operation: WorkflowOperationType, returnBatchId: boolean = false): Promise<number[]> {
        try {
            // Convert pageIDs array to comma-separated string for query parameter
            const pageIDsParam = pageIDs.join(',');
            // Convert enum to string name for API
            const operationName = WorkflowOperationType[operation];
            let apiPath = `${locale}/page/batch-workflow?pageIDs=${pageIDsParam}&operation=${operationName}`;

            // Send empty body since IDs are in query string
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, null);
            let batchID = resp.data as number;

            // If user wants batchID immediately, return it for custom polling
            if (returnBatchId) {
                return [batchID];
            }

            // Default behavior: wait for completion and return IDs
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID, guid));
            
            if(batch.batchState === BatchState.Processed && batch.errorData && batch.errorData.length > 0) {
                throw new Exception(`Unable to batch ${operationName.toLowerCase()} pages. Batch is not completed. Error: ${batch.errorData}`, null);
            }
            
            let processedPageIDs: number[] = [];

            batch.items.forEach(element => processedPageIDs.push(element.itemID));
            return processedPageIDs;
        } catch (err) {
            throw new Exception(`Unable to batch ${WorkflowOperationType[operation].toLowerCase()} pages.`, err);
        }
    }

    async pageRequestApproval(pageID: number, guid: string, locale: string, comments: string = null, returnBatchId: boolean = false): Promise<number[]> {
        try {
            let apiPath = `${locale}/page/${pageID}/request-approval?comments=${comments}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            let batchID = resp.data as number;

            // If user wants batchID immediately, return it for custom polling
            if (returnBatchId) {
                return [batchID];
            }

            // Default behavior: wait for completion and return IDs
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID, guid));
            let pageIDs: number[] = [];

            batch.items.forEach(element => pageIDs.push(element.itemID));
            return pageIDs;
        } catch (err) {
            throw new Exception(`Unable to request approval the page for id: ${pageID}`, err);
        }
    }

    async approvePage(pageID: number, guid: string, locale: string, comments: string = null, returnBatchId: boolean = false): Promise<number[]> {
        try {
            let apiPath = `${locale}/page/${pageID}/approve?comments=${comments}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            let batchID = resp.data as number;

            // If user wants batchID immediately, return it for custom polling
            if (returnBatchId) {
                return [batchID];
            }

            // Default behavior: wait for completion and return IDs
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID, guid));
            let pageIDs: number[] = [];

            batch.items.forEach(element => pageIDs.push(element.itemID));
            return pageIDs;
        } catch (err) {
            throw new Exception(`Unable to approve the page for id: ${pageID}`, err);
        }
    }

    async declinePage(pageID: number, guid: string, locale: string, comments: string = null, returnBatchId: boolean = false): Promise<number[]> {
        try {
            let apiPath = `${locale}/page/${pageID}/decline?comments=${comments}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            let batchID = resp.data as number;

            // If user wants batchID immediately, return it for custom polling
            if (returnBatchId) {
                return [batchID];
            }

            // Default behavior: wait for completion and return IDs
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID, guid));
            let pageIDs: number[] = [];

            batch.items.forEach(element => pageIDs.push(element.itemID));
            return pageIDs;
        } catch (err) {
            throw new Exception(`Unable to decline the page for id: ${pageID}`, err);
        }
    }

    async deletePage(pageID: number, guid: string, locale: string, comments: string = null, returnBatchId: boolean = false): Promise<number[]> {
        try {
            let apiPath = `${locale}/page/${pageID}?comments=${comments}`;
            const resp = await this._clientInstance.executeDelete(apiPath, guid, this._options.token);

            let batchID = resp.data as number;

            // If user wants batchID immediately, return it for custom polling
            if (returnBatchId) {
                return [batchID];
            }

            // Default behavior: wait for completion and return IDs
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID, guid));
            let pageIDs: number[] = [];

            batch.items.forEach(element => pageIDs.push(element.itemID));
            return pageIDs;
        } catch (err) {
            throw new Exception(`Unable to delete the page for id: ${pageID}`, err);
        }
    }

    /**
     * Save a new page or update an existing page.
     * @param pageItem The PageItem to save
     * @param guid The GUID of the user making the request
     * @param locale The locale of the page
     * @param parentPageID The ID of the parent page
     * @param placeBeforePageItemID The ID of the page item to place this page before
     * @param returnBatchId Whether to return the batch ID immediately
     * @param pageIDInOtherLocale The ID of the page in the other locale if you need to link it up.
     * @param otherLocale The other locale to link the page to.
     * @param linkExistingComponents Whether to link existing components to the page. If not set, the page save will create new components for each content zone.
     * @returns The IDs of the created or updated pages
     */
    async savePage(pageItem: PageItem, guid: string, locale: string, parentPageID: number = -1, placeBeforePageItemID: number = -1, returnBatchId: boolean = false, pageIDInOtherLocale: number = -1, otherLocale: string = null, linkExistingComponents: boolean = false): Promise<number[]> {
        try {
            let apiPath = `${locale}/page?parentPageID=${parentPageID}&placeBeforePageItemID=${placeBeforePageItemID}`;
            if (pageIDInOtherLocale > -1 && otherLocale) {
                // If we have the other locale and the pageID in that locale, we need to link it up.
                apiPath += `&pageIDInOtherLocale=${pageIDInOtherLocale}&otherLocale=${otherLocale}`;
            }

            // if not set, the page save will create new components for each content zone.
            if (linkExistingComponents) {
                apiPath += `&linkExistingComponents=true`;
            }

            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, pageItem);

            let batchID = resp.data as number;

            // If user wants batchID immediately, return it for custom polling
            if (returnBatchId) {
                return [batchID];
            }

            // Default behavior: wait for completion and return IDs
            var batch = await this._batchMethods.Retry(async () => await this._batchMethods.getBatch(batchID, guid));
            let pageIDs: number[] = [];
            batch.items.forEach(element => pageIDs.push(element.itemID));
            return pageIDs;
        } catch (err) {
            throw new Exception(`Unable to create page. ${err}`, err);
        }
    }

    async getPageHistory(locale: string, guid: string, pageID: number, take: number = 50, skip: number = 0) {
        try {
            let apiPath = `${locale}/item/${pageID}/history?take=${take}&skip=${skip}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as PageHistory;
        } catch (err) {
            throw new Exception(`Unable to retrieve history for pageID: ${pageID}`)
        }
    }

    async getPageComments(locale: string, guid: string, pageID: number, take: number = 50, skip: number = 0) {
        try {
            let apiPath = `${locale}/item/${pageID}/history?take=${take}&skip=${skip}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as ItemComments;
        } catch (err) {
            throw new Exception(`Unable to retrieve history for pageID: ${pageID}`)
        }
    }
}