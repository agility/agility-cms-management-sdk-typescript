import { Options } from "../types/options";
import { ClientInstance } from "./clientInstance";
import { AssetMediaList, Media } from "../types/media";
import { Exception } from "../errors/exception";
import { assetGalleries } from "../types/assetGalleries";
import { assetMediaGrouping } from "../types/assetMediaGrouping";
import { assetContainer } from "../types/assetContainer";

export class AssetMethods{
    _options!: Options;
    _clientInstance!: ClientInstance;

    constructor(options: Options){
        this._options = options;
        this._clientInstance = new ClientInstance(this._options);
    }

    async deleteFile(mediaID: number, guid: string){
        try{
          let apiPath = `asset/delete/${mediaID}`;
          const resp = await this._clientInstance.executeDelete(apiPath, guid, this._options.token);
          if (!resp.ok) {
              const errorText = await resp.text();
              throw new Error(`API error deleting file! status: ${resp.status}, message: ${errorText}`);
          }
          return await resp.text(); // Assuming success returns text confirmation
        } catch(err){
            const innerError = err instanceof Error ? err : undefined;
            throw new Exception(`Unable to delete the media for mediaID: ${mediaID}`, innerError);
        }
    }

    async moveFile(mediaID: number, newFolder: string, guid: string){
        try{
          let folder = encodeURIComponent(newFolder)
          let apiPath = `asset/move/${mediaID}?newFolder=${folder}`;

          const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, null);
          return resp.data as Media;
        } catch(err){
            const innerError = err instanceof Error ? err : undefined;
            throw new Exception(`Unable to move the media for mediaID: ${mediaID}`, innerError);
        }
    }

    async getMediaList(pageSize: number, recordOffset: number, guid: string){
        try{
            let apiPath = `asset/list?pageSize=${pageSize}&recordOffset=${recordOffset}`;

            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);
            return resp.data as AssetMediaList;
        } catch(err){
            const innerError = err instanceof Error ? err : undefined;
            throw new Exception(`Unable to retrieve assets for the website.`, innerError);
        }
    }

    async getGalleries(guid: string, search: string | null = null, pageSize: number | null = null, rowIndex: number | null = null){
        try{
            // Ensure nulls are handled correctly in query string
            const queryParams = new URLSearchParams();
            if (search) queryParams.set('search', search);
            if (pageSize !== null) queryParams.set('pageSize', pageSize.toString());
            if (rowIndex !== null) queryParams.set('rowIndex', rowIndex.toString());
            let apiPath = `asset/galleries?${queryParams.toString()}`;

            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);
            return resp.data as assetGalleries;
        } catch(err){
            const innerError = err instanceof Error ? err : undefined;
            throw new Exception(`Unable to retrieve galleries for the website.`, innerError);
        }
    }

    async getGalleryById(guid: string, id: number){
        try{
            let apiPath = `/asset/gallery/${id}`;

            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);
            return resp.data as assetMediaGrouping
        } catch(err){
            const innerError = err instanceof Error ? err : undefined;
            throw new Exception(`Unable to retrieve gallery for id ${id}`, innerError);
        }
    }

    async getGalleryByName(guid: string, galleryName: string){
        try{
            let apiPath = `/asset/gallery?galleryName=${galleryName}`;

            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);
            return resp.data as assetMediaGrouping
        } catch(err){
            const innerError = err instanceof Error ? err : undefined;
            throw new Exception(`Unable to retrieve gallery for name ${galleryName}`, innerError);
        }
    }

    async getDefaultContainer(guid: string){
        try{
            let apiPath = `/asset/container`;

            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);
            return resp.data as assetContainer;
        } catch(err){
            const innerError = err instanceof Error ? err : undefined;
            throw new Exception(`Unable to retrieve container for guid ${guid}`, innerError);
        }
    }

    async saveGallery(guid: string, gallery: assetMediaGrouping){
        try{
            let apiPath = `/asset/gallery`;

            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, gallery);
            return resp.data as assetMediaGrouping;
        } catch(err){
            const innerError = err instanceof Error ? err : undefined;
            throw new Exception(`Unable to save gallery`, innerError);
        }
    }

    async deleteGallery(guid: string, id: number){
        try{
            let apiPath = `/asset/gallery/${id}`

            const resp = await this._clientInstance.executeDelete(apiPath, guid, this._options.token);
            if (!resp.ok) {
                const errorText = await resp.text();
                throw new Error(`API error deleting gallery! status: ${resp.status}, message: ${errorText}`);
            }
            return await resp.text(); // Assuming success returns text confirmation
        } catch(err){
            const innerError = err instanceof Error ? err : undefined;
            throw new Exception(`Unable to delete gallery for id ${id}`, innerError);
        }
    }

    async getAssetByID(mediaID: number, guid: string){
        try{
          let apiPath = `asset/${mediaID}`;
          const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

          return resp.data as Media;
        } catch(err){
            const innerError = err instanceof Error ? err : undefined;
            throw new Exception(`Unable to retrieve asset for mediaID ${mediaID}`, innerError);
        }
    }

    async getAssetByUrl(url: string, guid: string){
        try{
            let apiPath = `asset?url=${url}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as Media;
        } catch(err){
            const innerError = err instanceof Error ? err : undefined;
            throw new Exception(`Unable to retrieve asset for url ${url}`, innerError);
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
    async upload(formData: any, agilityFolderPath: string, guid: string, groupingID: number = -1){
        try{
            let apiPath = `asset/upload?folderPath=${agilityFolderPath}&groupingID=${groupingID}`;
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, formData);

            return resp.data as Media[];
        } catch(err){
            const innerError = err instanceof Error ? err : undefined;
            throw new Exception(`Unable to upload media.`, innerError);
        }
    }

    async createFolder(originKey: string, guid: string){
        try{
            let apiPath = `asset/folder?originKey=${originKey}`;
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, null);

            return resp.data as Media;
        } catch(err){
            const innerError = err instanceof Error ? err : undefined;
            throw new Exception('Unable to create folder.', innerError);
        }
    }

    async deleteFolder(originKey: string, guid: string, mediaID: number = 0){
        try{
            let apiPath = `asset/folder/delete?originKey=${originKey}&mediaID=${mediaID}`;
            await this._clientInstance.executePost(apiPath, guid, this._options.token, null);
            // Assuming no return value needed for successful delete via POST
        } catch(err){
            const innerError = err instanceof Error ? err : undefined;
            throw new Exception('Unable to delete folder.', innerError);
        }
    }

    async renameFolder(folderName: string, newFolderName: string, guid: string, mediaID: number = 0){
        try{
            let apiPath = `asset/folder/rename?folderName=${folderName}&newFolderName=${newFolderName}&mediaID=${mediaID}`;
            await this._clientInstance.executePost(apiPath, guid, this._options.token, null);
            // Assuming no return value needed for successful rename via POST
        } catch(err){
            const innerError = err instanceof Error ? err : undefined;
            throw new Exception('Unable to rename folder.', innerError);
        }
    }
}