import { ContentItem, ContentList } from '../models/contentItem';
import { ContentItemHistory } from '../models/contentItemHistory';
import { ContentListFilterModel } from '../models/contentListFilterModel';
import { Exception } from '../models/exception';
import { ItemComments } from '../models/itemComments';
import { ListParams } from '../models/listParams';
import { Options } from '../models/options';

import { BatchMethods } from './batchMethods';
import { ClientInstance } from './clientInstance';

export class ContentMethods {
	_options!: Options;
	_clientInstance!: ClientInstance;
	_batchMethods: BatchMethods;

	constructor(options: Options) {
		this._options = options;
		this._clientInstance = new ClientInstance(this._options);
		this._batchMethods = new BatchMethods(this._options);
	}

	async getContentItem(contentID: number, guid: string, locale: string) {
		try {
			const apiPath = `${locale}/item/${contentID}`;
			const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

			return resp.data as ContentItem;
		} catch (err) {
			throw new Exception(`Unable to retrieve the content for id: ${contentID}`, err as Error);
		}
	}

	async publishContent(
		contentID: number,
		guid: string,
		locale: string,
		comments?: string,
		returnBatchId: boolean = false
	): Promise<number[]> {
		try {
			const apiPath = `${locale}/item/${contentID}/publish?comments=${comments}`;
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
			const contentIDs: number[] = [];

			batch.items.forEach(element => contentIDs.push(element.itemID));
			return contentIDs;
		} catch (err) {
			throw new Exception(`Unable to publish the content for id: ${contentID}`, err as Error);
		}
	}

	async unPublishContent(
		contentID: number,
		guid: string,
		locale: string,
		comments?: string,
		returnBatchId: boolean = false
	): Promise<number[]> {
		try {
			const apiPath = `${locale}/item/${contentID}/unpublish?comments=${comments}`;
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
			const contentIDs: number[] = [];

			batch.items.forEach(element => contentIDs.push(element.itemID));
			return contentIDs;
		} catch (err) {
			throw new Exception(`Unable to un-publish the content for id: ${contentID}`, err as Error);
		}
	}

	async contentRequestApproval(
		contentID: number,
		guid: string,
		locale: string,
		comments?: string,
		returnBatchId: boolean = false
	): Promise<number[]> {
		try {
			const apiPath = `${locale}/item/${contentID}/request-approval?comments=${comments}`;
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
			const contentIDs: number[] = [];

			batch.items.forEach(element => contentIDs.push(element.itemID));
			return contentIDs;
		} catch (err) {
			throw new Exception(
				`Unable to request approval the content for id: ${contentID}`,
				err as Error
			);
		}
	}

	async approveContent(
		contentID: number,
		guid: string,
		locale: string,
		comments?: string,
		returnBatchId: boolean = false
	): Promise<number[]> {
		try {
			const apiPath = `${locale}/item/${contentID}/approve?comments=${comments}`;
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
			const contentIDs: number[] = [];

			batch.items.forEach(element => contentIDs.push(element.itemID));
			return contentIDs;
		} catch (err) {
			throw new Exception(`Unable to approve the content for id: ${contentID}`, err as Error);
		}
	}

	async declineContent(
		contentID: number,
		guid: string,
		locale: string,
		comments?: string,
		returnBatchId: boolean = false
	): Promise<number[]> {
		try {
			const apiPath = `${locale}/item/${contentID}/decline?comments=${comments}`;
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
			const contentIDs: number[] = [];

			batch.items.forEach(element => contentIDs.push(element.itemID));
			return contentIDs;
		} catch (err) {
			throw new Exception(`Unable to decline the content for id: ${contentID}`, err as Error);
		}
	}

	async deleteContent(
		contentID: number,
		guid: string,
		locale: string,
		comments?: string,
		returnBatchId: boolean = false
	): Promise<number[]> {
		try {
			const apiPath = `${locale}/item/${contentID}?comments=${comments}`;
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
			const contentIDs: number[] = [];

			batch.items.forEach(element => contentIDs.push(element.itemID));
			return contentIDs;
		} catch (err) {
			throw new Exception(`Unable to delete the content for id: ${contentID}`, err as Error);
		}
	}

	async saveContentItem(
		contentItem: ContentItem,
		guid: string,
		locale: string,
		returnBatchId: boolean = false
	): Promise<number[]> {
		try {
			const apiPath = `${locale}/item`;
			const resp = await this._clientInstance.executePost(
				apiPath,
				guid,
				this._options.token,
				contentItem
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
			const contentIDs: number[] = [];
			batch.items.forEach(element => contentIDs.push(element.itemID));
			return contentIDs;
		} catch (err) {
			throw new Exception('Unable to create content.', err as Error);
		}
	}

	async saveContentItems(
		contentItems: ContentItem[],
		guid: string,
		locale: string,
		returnBatchId: boolean = false
	): Promise<number[]> {
		try {
			const apiPath = `${locale}/item/multi`;
			const resp = await this._clientInstance.executePost(
				apiPath,
				guid,
				this._options.token,
				contentItems
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
			const contentIDs: number[] = [];

			batch.items.forEach(element => contentIDs.push(element.itemID));
			return contentIDs;
		} catch (err) {
			throw new Exception('Unable to create contents.', err as Error);
		}
	}

	async getContentItems(
		referenceName: string,
		guid: string,
		locale: string,
		listParams: ListParams
	) {
		try {
			const apiPath = `${locale}/list/${referenceName}?filter=${listParams.filter}&fields=${listParams.fields}&sortDirection=${listParams.sortDirection}&sortField=${listParams.sortField}&take=${listParams.take}&skip=${listParams.skip}`;
			const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

			return resp.data as ContentList;
		} catch (err) {
			throw new Exception(
				`Unable retrieve the content details for reference name: ${referenceName}`,
				err as Error
			);
		}
	}

	async getContentList(
		referenceName: string,
		guid: string,
		locale: string,
		listParams: ListParams,
		filterObject?: ContentListFilterModel
	) {
		try {
			const apiPath = `${locale}/list/${referenceName}?fields=${listParams.fields}&sortDirection=${listParams.sortDirection}&sortField=${listParams.sortField}&take=${listParams.take}&skip=${listParams.skip}&showDeleted=${listParams.showDeleted}`;
			const resp = await this._clientInstance.executePost(
				apiPath,
				guid,
				this._options.token,
				filterObject
			);

			return resp.data as ContentList;
		} catch (err) {
			throw new Exception(
				`Unable retrieve the content details for list with reference name: ${referenceName}`,
				err as Error
			);
		}
	}

	async getContentHistory(
		locale: string,
		guid: string,
		contentID: number,
		take: number = 50,
		skip: number = 0
	) {
		try {
			const apiPath = `${locale}/item/${contentID}/history?take=${take}&skip=${skip}`;
			const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

			return resp.data as ContentItemHistory;
		} catch (err) {
			throw new Exception(`Unable to retrieve history for contentID: ${contentID}`);
		}
	}

	async getContentComments(
		locale: string,
		guid: string,
		contentID: number,
		take: number = 50,
		skip: number = 0
	) {
		try {
			const apiPath = `${locale}/item/${contentID}/comments?take=${take}&skip=${skip}`;
			const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

			return resp.data as ItemComments;
		} catch (err) {
			throw new Exception(`Unable to retrieve comments for contentID: ${contentID}`);
		}
	}
}
