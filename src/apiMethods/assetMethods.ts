import { Options } from "../types/options";
import { ClientInstance } from "./clientInstance";
import { AssetMediaList, Media } from "../types/media";
import { Exception } from "../errors/exception";
import { assetGalleries } from "../types/assetGalleries";
import { assetMediaGrouping } from "../types/assetMediaGrouping";
import { assetContainer } from "../types/assetContainer";
// import { DeleteResponse } from "../types/apiResponse";

export class AssetMethods{
    _options!: Options;
    _clientInstance!: ClientInstance;

    constructor(options: Options){
        this._options = options;
        this._clientInstance = new ClientInstance(this._options);
    }

    /**
     * Deletes a specific media file.
     * @param mediaID The numeric ID of the media file.
     * @param guid The instance GUID.
     * @returns A promise resolving when the deletion is complete.
     */
    async deleteFile(mediaID: number, guid: string): Promise<void> {
        try{
          let apiPath = `asset/delete/${mediaID}`;
          await this._clientInstance.executeDelete(apiPath, guid, this._options.token);
        } catch(err){
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to delete the media for mediaID: ${mediaID}`, error);
        }
    }

    /**
     * Moves a media file to a different folder.
     * @param mediaID The ID of the media file to move.
     * @param newFolder The destination folder path.
     * @param guid The instance GUID.
     * @returns A promise resolving to the updated Media object.
     */
    async moveFile(mediaID: number, newFolder: string, guid: string): Promise<Media> {
        try{
          let folder = encodeURIComponent(newFolder)
          let apiPath = `asset/move/${mediaID}?newFolder=${folder}`;

          const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, null);
          if (!resp?.mediaID) {
              throw new Error("Invalid response structure for moved Media.");
          }
          return resp as Media;
        } catch(err){
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to move the media for mediaID: ${mediaID}`, error);
        }
    }

    /**
     * Retrieves a paginated list of media assets.
     * @param pageSize The number of items per page.
     * @param recordOffset The starting record index (0-based).
     * @param guid The instance GUID.
     * @returns A promise resolving to an AssetMediaList object.
     */
    async getMediaList(pageSize: number, recordOffset: number, guid: string): Promise<AssetMediaList> {
        try{
            let apiPath = `asset/list?pageSize=${pageSize}&recordOffset=${recordOffset}`;

            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);
            if (!resp?.assetMedias || !Array.isArray(resp.assetMedias)) {
                throw new Error("Invalid response structure for AssetMediaList. Expected 'assetMedias' array.");
            }
            return resp as AssetMediaList;
        } catch(err){
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to retrieve assets for the website.`, error);
        }
    }

    /**
     * Retrieves a list of asset galleries.
     * @param guid The instance GUID.
     * @param search Optional search term.
     * @param pageSize Optional page size.
     * @param rowIndex Optional starting row index.
     * @returns A promise resolving to an assetGalleries object.
     */
    async getGalleries(guid: string, search: string | null = null, pageSize: number | null = null, rowIndex: number | null = null): Promise<assetGalleries> {
        try{
            const queryParams = new URLSearchParams();
            if (search) queryParams.set('search', search);
            if (pageSize !== null) queryParams.set('pageSize', pageSize.toString());
            if (rowIndex !== null) queryParams.set('rowIndex', rowIndex.toString());
            let apiPath = `asset/galleries?${queryParams.toString()}`;

            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);
            if (!resp?.assetMediaGroupings || !Array.isArray(resp.assetMediaGroupings)) {
                throw new Error("Invalid response structure for assetGalleries. Expected 'assetMediaGroupings' array.");
            }
            return resp as assetGalleries;
        } catch(err){
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to retrieve galleries for the website.`, error);
        }
    }

    /**
     * Retrieves a specific asset gallery by its ID.
     * @param guid The instance GUID.
     * @param id The numeric ID of the gallery.
     * @returns A promise resolving to an assetMediaGrouping object.
     */
    async getGalleryById(guid: string, id: number): Promise<assetMediaGrouping> {
        try{
            let apiPath = `/asset/gallery/${id}`;

            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);
            if (!resp?.galleryID) {
                throw new Error("Invalid response structure for assetMediaGrouping.");
            }
            return resp as assetMediaGrouping;
        } catch(err){
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to retrieve gallery for id ${id}`, error);
        }
    }

    /**
     * Retrieves a specific asset gallery by its name.
     * @param guid The instance GUID.
     * @param galleryName The name of the gallery.
     * @returns A promise resolving to an assetMediaGrouping object.
     */
    async getGalleryByName(guid: string, galleryName: string): Promise<assetMediaGrouping> {
        try{
            let apiPath = `/asset/gallery?galleryName=${encodeURIComponent(galleryName)}`;

            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);
            if (!resp?.galleryID) {
                throw new Error("Invalid response structure for assetMediaGrouping.");
            }
            return resp as assetMediaGrouping;
        } catch(err){
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to retrieve gallery for name ${galleryName}`, error);
        }
    }

    /**
     * Retrieves the default asset container details.
     * @param guid The instance GUID.
     * @returns A promise resolving to an assetContainer object.
     */
    async getDefaultContainer(guid: string): Promise<assetContainer> {
        try{
            let apiPath = `/asset/container`;

            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);
            if (!resp?.containerID) {
                throw new Error("Invalid response structure for assetContainer.");
            }
            return resp as assetContainer;
        } catch(err){
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to retrieve container for guid ${guid}`, error);
        }
    }

    /**
     * Saves (creates or updates) an asset gallery.
     * @param guid The instance GUID.
     * @param gallery The assetMediaGrouping object to save.
     * @returns A promise resolving to the saved assetMediaGrouping object.
     */
    async saveGallery(guid: string, gallery: assetMediaGrouping): Promise<assetMediaGrouping> {
        try{
            let apiPath = `/asset/gallery`;

            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, gallery);
            if (!resp?.galleryID) {
                throw new Error("Invalid response structure for saved assetMediaGrouping.");
            }
            return resp as assetMediaGrouping;
        } catch(err){
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to save gallery`, error);
        }
    }

    /**
     * Deletes a specific asset gallery.
     * @param guid The instance GUID.
     * @param id The numeric ID of the gallery to delete.
     * @returns A promise resolving when the deletion is complete.
     */
    async deleteGallery(guid: string, id: number): Promise<void> {
        try{
            let apiPath = `/asset/gallery/${id}`

            await this._clientInstance.executeDelete(apiPath, guid, this._options.token);
        } catch(err){
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to delete gallery for id ${id}`, error);
        }
    }

    /**
     * Retrieves a specific media asset by its ID.
     * @param mediaID The numeric ID of the media asset.
     * @param guid The instance GUID.
     * @returns A promise resolving to the Media object.
     */
    async getAssetByID(mediaID: number, guid: string): Promise<Media> {
        try{
          let apiPath = `asset/${mediaID}`;
          const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

          if (!resp?.mediaID) {
              throw new Error("Invalid response structure for Media.");
          }
          return resp as Media;
        } catch(err){
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to retrieve asset for mediaID ${mediaID}`, error);
        }
    }

    /**
     * Retrieves a specific media asset by its URL.
     * @param url The URL of the media asset.
     * @param guid The instance GUID.
     * @returns A promise resolving to the Media object.
     */
    async getAssetByUrl(url: string, guid: string): Promise<Media> {
        try{
            let apiPath = `asset?url=${encodeURIComponent(url)}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            if (!resp?.mediaID) {
                throw new Error("Invalid response structure for Media.");
            }
            return resp as Media;
        } catch(err){
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to retrieve asset for url ${url}`, error);
        }
    }

    /**
     * Uploads one or more files.
     * @param formData The FormData object containing the file(s).
     * @param agilityFolderPath The target folder path within Agility Assets.
     * @param guid The instance GUID.
     * @param groupingID Optional gallery ID to associate the upload with.
     * @returns A promise resolving to an array of Media objects for the uploaded file(s).
     */
    async upload(formData: FormData, agilityFolderPath: string, guid: string, groupingID: number = -1): Promise<Media[]> {
        try{
            let apiPath = `asset/upload?folderPath=${encodeURIComponent(agilityFolderPath)}&groupingID=${groupingID}`;
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, formData);

            if (!Array.isArray(resp)) {
                throw new Error("Invalid response structure for uploaded Media list.");
            }
            return resp as Media[];
        } catch(err){
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception(`Unable to upload media.`, error);
        }
    }

    /**
     * Creates a new folder in Assets.
     * @param originKey The full path of the folder to create.
     * @param guid The instance GUID.
     * @returns A promise resolving to the Media object representing the created folder.
     */
    async createFolder(originKey: string, guid: string): Promise<Media> {
        try{
            let apiPath = `asset/folder?originKey=${encodeURIComponent(originKey)}`;
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, null);

            if (!resp?.mediaID || !resp?.isFolder) {
                throw new Error("Invalid response structure for created Folder.");
            }
            return resp as Media;
        } catch(err){
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception('Unable to create folder.', error);
        }
    }

    /**
     * Deletes an empty folder in Assets.
     * @param originKey The full path of the folder to delete.
     * @param guid The instance GUID.
     * @param mediaID Optional media ID (seems unused by API path? Clarify purpose).
     * @returns A promise resolving when the deletion is complete.
     */
    async deleteFolder(originKey: string, guid: string, mediaID: number = 0): Promise<void> {
        try{
            let apiPath = `asset/folder/delete?originKey=${encodeURIComponent(originKey)}&mediaID=${mediaID}`;
            await this._clientInstance.executePost(apiPath, guid, this._options.token, null);
        } catch(err){
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception('Unable to delete folder.', error);
        }
    }

    /**
     * Renames a folder in Assets.
     * @param folderName The current full path of the folder.
     * @param newFolderName The new full path for the folder.
     * @param guid The instance GUID.
     * @param mediaID Optional media ID (seems unused by API path? Clarify purpose).
     * @returns A promise resolving when the rename is complete.
     */
    async renameFolder(folderName: string, newFolderName: string, guid: string, mediaID: number = 0): Promise<void> {
        try{
            let apiPath = `asset/folder/rename?folderName=${encodeURIComponent(folderName)}&newFolderName=${encodeURIComponent(newFolderName)}&mediaID=${mediaID}`;
            await this._clientInstance.executePost(apiPath, guid, this._options.token, null);
        } catch(err){
            const error = err instanceof Error ? err : new Error(String(err));
            throw new Exception('Unable to rename folder.', error);
        }
    }
}