import { assetContainer } from '../models/assetContainer';
import { assetGalleries } from '../models/assetGalleries';
import { assetMediaGrouping } from '../models/assetMediaGrouping';
import { Exception } from '../models/exception';
import { AssetMediaList, Media } from '../models/media';
import { Options } from '../models/options';

import { ClientInstance } from './clientInstance';

export class AssetMethods {
	_options!: Options;
	_clientInstance!: ClientInstance;

	constructor(options: Options) {
		this._options = options;
		this._clientInstance = new ClientInstance(this._options);
	}

	async deleteFile(mediaID: number, guid: string) {
		try {
			const apiPath = `asset/delete/${mediaID}`;
			const resp = await this._clientInstance.executeDelete(apiPath, guid, this._options.token);
			return resp.data as string;
		} catch (err) {
			throw new Exception(`Unable to delete the media for mediaID: ${mediaID}`, err as Error);
		}
	}

	async moveFile(mediaID: number, newFolder: string, guid: string) {
		try {
			const folder = encodeURIComponent(newFolder);
			const apiPath = `asset/move/${mediaID}?newFolder=${folder}`;

			const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, null);
			return resp.data as Media;
		} catch (err) {
			throw new Exception(`Unable to move the media for mediaID: ${mediaID}`, err as Error);
		}
	}

	async getMediaList(pageSize: number, recordOffset: number, guid: string) {
		try {
			const apiPath = `asset/list?pageSize=${pageSize}&recordOffset=${recordOffset}`;

			const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);
			return resp.data as AssetMediaList;
		} catch (err) {
			throw new Exception(`Unable to retrieve assets for the website.`, err as Error);
		}
	}

	async getGalleries(guid: string, search?: string, pageSize?: number, rowIndex?: number) {
		try {
			const apiPath = `asset/galleries?search=${search}&pageSize=${pageSize}&rowIndex=${rowIndex}`;

			const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);
			return resp.data as assetGalleries;
		} catch (err) {
			throw new Exception(`Unable to retrieve galleries for the website.`, err as Error);
		}
	}

	async getGalleryById(guid: string, id: number) {
		try {
			const apiPath = `/asset/gallery/${id}`;

			const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);
			return resp.data as assetMediaGrouping;
		} catch (err) {
			throw new Exception(`Unable to retrieve gallery for id ${id}`, err as Error);
		}
	}

	async getGalleryByName(guid: string, galleryName: string) {
		try {
			const apiPath = `/asset/gallery?galleryName=${galleryName}`;

			const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);
			return resp.data as assetMediaGrouping;
		} catch (err) {
			throw new Exception(`Unable to retrieve gallery for name ${galleryName}`, err as Error);
		}
	}

	async getDefaultContainer(guid: string) {
		try {
			const apiPath = `/asset/container`;

			const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);
			return resp.data as assetContainer;
		} catch (err) {
			throw new Exception(`Unable to retrieve container for guid ${guid}`, err as Error);
		}
	}

	async saveGallery(guid: string, gallery: assetMediaGrouping) {
		try {
			const apiPath = `/asset/gallery`;

			const resp = await this._clientInstance.executePost(
				apiPath,
				guid,
				this._options.token,
				gallery
			);
			return resp.data as assetMediaGrouping;
		} catch (err) {
			throw new Exception(`Unable to save gallery`, err as Error);
		}
	}

	async deleteGallery(guid: string, id: number) {
		try {
			const apiPath = `/asset/gallery/${id}`;

			const resp = await this._clientInstance.executeDelete(apiPath, guid, this._options.token);
			return resp.data as string;
		} catch (err) {
			throw new Exception(`Unable to delete gallery for id ${id}`, err as Error);
		}
	}

	async getAssetByID(mediaID: number, guid: string) {
		try {
			const apiPath = `asset/${mediaID}`;
			const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

			return resp.data as Media;
		} catch (err) {
			throw new Exception(`Unable to retrieve asset for mediaID ${mediaID}`, err as Error);
		}
	}

	async getAssetByUrl(url: string, guid: string) {
		try {
			const apiPath = `asset?url=${url}`;
			const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

			return resp.data as Media;
		} catch (err) {
			throw new Exception(`Unable to retrieve asset for url ${url}`, err as Error);
		}
	}

	/**
	 * Uploads a file to the specified folder path.
	 *
	 * @param {*} formData - FormData object that axios is expecting for the Upload.
	 * @param {string} agilityFolderPath
	 * @param {string} guid
	 * @param {number} [groupingID=-1]
	 * @returns
	 * @memberof AssetMethods
	 */
	async upload(formData: any, agilityFolderPath: string, guid: string, groupingID: number = -1) {
		try {
			const apiPath = `asset/upload?folderPath=${agilityFolderPath}&groupingID=${groupingID}`;
			const resp = await this._clientInstance.executePost(
				apiPath,
				guid,
				this._options.token,
				formData
			);

			return resp.data as Media[];
		} catch (err) {
			throw new Exception(`Unable to upload media.`, err as Error);
		}
	}

	async createFolder(originKey: string, guid: string) {
		try {
			const apiPath = `asset/folder?originKey=${originKey}`;
			const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, null);

			return resp.data as Media;
		} catch (err) {
			throw new Exception('Unable to create folder.', err as Error);
		}
	}

	async deleteFolder(originKey: string, guid: string, mediaID: number = 0) {
		try {
			const apiPath = `asset/folder/delete?originKey=${originKey}&mediaID=${mediaID}`;
			await this._clientInstance.executePost(apiPath, guid, this._options.token, null);
		} catch (err) {
			throw new Exception('Unable to delete folder.', err as Error);
		}
	}

	async renameFolder(folderName: string, newFolderName: string, guid: string, mediaID: number = 0) {
		try {
			const apiPath = `asset/folder/rename?folderName=${folderName}&newFolderName=${newFolderName}&mediaID=${mediaID}`;
			await this._clientInstance.executePost(apiPath, guid, this._options.token, null);
		} catch (err) {
			throw new Exception('Unable to rename folder.', err as Error);
		}
	}
}
