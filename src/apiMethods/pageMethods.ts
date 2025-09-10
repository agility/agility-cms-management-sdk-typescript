import { ContentSectionDefinition } from '../models/contentSectionDefinition';
import { Exception } from '../models/exception';
import { ItemComments } from '../models/itemComments';
import { Options } from '../models/options';
import { PageHistory } from '../models/pageHistory';
import { PageItem } from '../models/pageItem';
import { PageModel } from '../models/pageModel';
import { Sitemap } from '../models/sitemap';

import { BatchMethods } from './batchMethods';
import { ClientInstance } from './clientInstance';

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
			const apiPath = `${locale}/sitemap`;
			const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

			return resp.data as Sitemap[];
		} catch (err) {
			throw new Exception(`Unable to retrieve sitemap.`, err as Error);
		}
	}

	async getPageTemplates(
		guid: string,
		locale: string,
		includeModuleZones: boolean,
		searchFilter?: string
	) {
		try {
			searchFilter ??= '';
			const apiPath = `${locale}/page/templates?includeModuleZones=${includeModuleZones}&searchFilter=${searchFilter}`;
			const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

			return resp.data as PageModel[];
		} catch (err) {
			throw new Exception(`Unable to retrieve Page Templates.`, err as Error);
		}
	}

	async getPageTemplate(guid: string, locale: string, pageTemplateId: number) {
		try {
			const apiPath = `${locale}/page/template/${pageTemplateId}`;
			const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

			return resp.data as PageModel;
		} catch (err) {
			throw new Exception(`Unable to retrieve Page Template.`, err as Error);
		}
	}

	async getPageTemplateName(guid: string, locale: string, templateName: string) {
		try {
			const apiPath = `${locale}/page/template/${templateName}`;
			const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

			return resp.data as PageModel;
		} catch (err) {
			throw new Exception(`Unable to retrieve Page Template.`, err as Error);
		}
	}

	async deletePageTemplate(guid: string, locale: string, pageTemplateId: number) {
		try {
			const apiPath = `${locale}/page/template/${pageTemplateId}`;

			const resp = await this._clientInstance.executeDelete(apiPath, guid, this._options.token);

			return resp.data as string;
		} catch (err) {
			throw new Exception(`Unable to delete Page Template.`, err as Error);
		}
	}

	async getPageItemTemplates(guid: string, locale: string, id: number) {
		try {
			const apiPath = `${locale}/page/template/items/${id}`;
			const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

			return resp.data as ContentSectionDefinition[];
		} catch (err) {
			throw new Exception(`Unable to retrieve Page Template Items.`, err as Error);
		}
	}

	async savePageTemplate(guid: string, locale: string, pageModel: PageModel) {
		try {
			const apiPath = `${locale}/page/template`;
			const resp = await this._clientInstance.executePost(
				apiPath,
				guid,
				this._options.token,
				pageModel
			);

			return resp.data as PageModel;
		} catch (err) {
			throw new Exception(`Unable to save Page Template.`, err as Error);
		}
	}

	async getPage(pageID: number, guid: string, locale: string) {
		try {
			const apiPath = `${locale}/page/${pageID}`;
			const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

			return resp.data as PageItem;
		} catch (err) {
			throw new Exception(`Unable to retrieve page for id ${pageID}.`, err as Error);
		}
	}

	async publishPage(
		pageID: number,
		guid: string,
		locale: string,
		comments?: string,
		returnBatchId: boolean = false
	): Promise<number[]> {
		try {
			const apiPath = `${locale}/page/${pageID}/publish?comments=${comments}`;
			const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

			const batchID = resp.data as number;

			// If user wants batchID immediately, return it for custom polling
			if (returnBatchId) {
				return [batchID];
			}

			// Default behavior: wait for completion and return IDs
			const batch = await this._batchMethods.Retry(
				async () => await this._batchMethods.getBatch(batchID, guid)
			);
			const pageIDs: number[] = [];

			batch.items.forEach(element => pageIDs.push(element.itemID));
			return pageIDs;
		} catch (err) {
			throw new Exception(`Unable to publish the page for id: ${pageID}`, err as Error);
		}
	}

	async unPublishPage(
		pageID: number,
		guid: string,
		locale: string,
		comments?: string,
		returnBatchId: boolean = false
	): Promise<number[]> {
		try {
			const apiPath = `${locale}/page/${pageID}/unpublish?comments=${comments}`;
			const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

			const batchID = resp.data as number;

			// If user wants batchID immediately, return it for custom polling
			if (returnBatchId) {
				return [batchID];
			}

			// Default behavior: wait for completion and return IDs
			const batch = await this._batchMethods.Retry(
				async () => await this._batchMethods.getBatch(batchID, guid)
			);
			const pageIDs: number[] = [];

			batch.items.forEach(element => pageIDs.push(element.itemID));
			return pageIDs;
		} catch (err) {
			throw new Exception(`Unable to un-publish the page for id: ${pageID}`, err as Error);
		}
	}

	async pageRequestApproval(
		pageID: number,
		guid: string,
		locale: string,
		comments?: string,
		returnBatchId: boolean = false
	): Promise<number[]> {
		try {
			const apiPath = `${locale}/page/${pageID}/request-approval?comments=${comments}`;
			const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

			const batchID = resp.data as number;

			// If user wants batchID immediately, return it for custom polling
			if (returnBatchId) {
				return [batchID];
			}

			// Default behavior: wait for completion and return IDs
			const batch = await this._batchMethods.Retry(
				async () => await this._batchMethods.getBatch(batchID, guid)
			);
			const pageIDs: number[] = [];

			batch.items.forEach(element => pageIDs.push(element.itemID));
			return pageIDs;
		} catch (err) {
			throw new Exception(`Unable to request approval the page for id: ${pageID}`, err as Error);
		}
	}

	async approvePage(
		pageID: number,
		guid: string,
		locale: string,
		comments?: string,
		returnBatchId: boolean = false
	): Promise<number[]> {
		try {
			const apiPath = `${locale}/page/${pageID}/approve?comments=${comments}`;
			const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

			const batchID = resp.data as number;

			// If user wants batchID immediately, return it for custom polling
			if (returnBatchId) {
				return [batchID];
			}

			// Default behavior: wait for completion and return IDs
			const batch = await this._batchMethods.Retry(
				async () => await this._batchMethods.getBatch(batchID, guid)
			);
			const pageIDs: number[] = [];

			batch.items.forEach(element => pageIDs.push(element.itemID));
			return pageIDs;
		} catch (err) {
			throw new Exception(`Unable to approve the page for id: ${pageID}`, err as Error);
		}
	}

	async declinePage(
		pageID: number,
		guid: string,
		locale: string,
		comments?: string,
		returnBatchId: boolean = false
	): Promise<number[]> {
		try {
			const apiPath = `${locale}/page/${pageID}/decline?comments=${comments}`;
			const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

			const batchID = resp.data as number;

			// If user wants batchID immediately, return it for custom polling
			if (returnBatchId) {
				return [batchID];
			}

			// Default behavior: wait for completion and return IDs
			const batch = await this._batchMethods.Retry(
				async () => await this._batchMethods.getBatch(batchID, guid)
			);
			const pageIDs: number[] = [];

			batch.items.forEach(element => pageIDs.push(element.itemID));
			return pageIDs;
		} catch (err) {
			throw new Exception(`Unable to decline the page for id: ${pageID}`, err as Error);
		}
	}

	async deletePage(
		pageID: number,
		guid: string,
		locale: string,
		comments?: string,
		returnBatchId: boolean = false
	): Promise<number[]> {
		try {
			const apiPath = `${locale}/page/${pageID}?comments=${comments}`;
			const resp = await this._clientInstance.executeDelete(apiPath, guid, this._options.token);

			const batchID = resp.data as number;

			// If user wants batchID immediately, return it for custom polling
			if (returnBatchId) {
				return [batchID];
			}

			// Default behavior: wait for completion and return IDs
			const batch = await this._batchMethods.Retry(
				async () => await this._batchMethods.getBatch(batchID, guid)
			);
			const pageIDs: number[] = [];

			batch.items.forEach(element => pageIDs.push(element.itemID));
			return pageIDs;
		} catch (err) {
			throw new Exception(`Unable to delete the page for id: ${pageID}`, err as Error);
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
	 * @returns The IDs of the created or updated pages
	 */
	async savePage(
		pageItem: PageItem,
		guid: string,
		locale: string,
		parentPageID: number = -1,
		placeBeforePageItemID: number = -1,
		returnBatchId: boolean = false,
		pageIDInOtherLocale: number = -1,
		otherLocale?: string
	): Promise<number[]> {
		try {
			let apiPath = `${locale}/page?parentPageID=${parentPageID}&placeBeforePageItemID=${placeBeforePageItemID}`;
			if (pageIDInOtherLocale > -1 && otherLocale) {
				// If we have the other locale and the pageID in that locale, we need to link it up.
				apiPath += `&pageIDInOtherLocale=${pageIDInOtherLocale}&otherLocale=${otherLocale}`;
			}
			const resp = await this._clientInstance.executePost(
				apiPath,
				guid,
				this._options.token,
				pageItem
			);

			const batchID = resp.data as number;

			// If user wants batchID immediately, return it for custom polling
			if (returnBatchId) {
				return [batchID];
			}

			// Default behavior: wait for completion and return IDs
			const batch = await this._batchMethods.Retry(
				async () => await this._batchMethods.getBatch(batchID, guid)
			);
			const pageIDs: number[] = [];
			batch.items.forEach(element => pageIDs.push(element.itemID));
			return pageIDs;
		} catch (err) {
			throw new Exception(`Unable to create page. ${err}`, err as Error);
		}
	}

	async getPageHistory(
		locale: string,
		guid: string,
		pageID: number,
		take: number = 50,
		skip: number = 0
	) {
		try {
			const apiPath = `${locale}/item/${pageID}/history?take=${take}&skip=${skip}`;
			const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

			return resp.data as PageHistory;
		} catch (err) {
			throw new Exception(`Unable to retrieve history for pageID: ${pageID}`, err as Error);
		}
	}

	async getPageComments(
		locale: string,
		guid: string,
		pageID: number,
		take: number = 50,
		skip: number = 0
	) {
		try {
			const apiPath = `${locale}/item/${pageID}/history?take=${take}&skip=${skip}`;
			const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

			return resp.data as ItemComments;
		} catch (err) {
			throw new Exception(`Unable to retrieve comments for pageID: ${pageID}`, err as Error);
		}
	}
}
