import { Options } from "../models/options";
import { ClientInstance } from "./clientInstance";
import { AssetMediaList, Media } from "../models/media";
import { Exception } from "../models/exception";
import { assetGalleries } from "../models/assetGalleries";
import { assetMediaGrouping } from "../models/assetMediaGrouping";
import { assetContainer } from "../models/assetContainer";

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
          const resp = await this._clientInstance.executeDelete(apiPath, guid, this._options.token);;
          return resp.data as string;
        } catch(err){
            throw new Exception(`Unable to delete the media for mediaID: ${mediaID}`, err);
        }
    }

    async moveFile(mediaID: number, newFolder: string, guid: string){
        try{
          let folder = encodeURIComponent(newFolder)
          let apiPath = `asset/move/${mediaID}?newFolder=${folder}`;

          const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, null);
          return resp.data as Media;
        } catch(err){
            throw new Exception(`Unable to move the media for mediaID: ${mediaID}`, err);
        }
    }

    async getMediaList(pageSize: number, recordOffset: number, guid: string){
        try{
            let apiPath = `asset/list?pageSize=${pageSize}&recordOffset=${recordOffset}`;

            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);
            return resp.data as AssetMediaList;
        } catch(err){
            throw new Exception(`Unable to retrieve assets for the website.`, err);
        }
    }

    async getGalleries(guid: string, search: string = null, pageSize: number = null, rowIndex: number = null){
        try{
            let apiPath = `asset/galleries?search=${search}&pageSize=${pageSize}&rowIndex=${rowIndex}`;

            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);
            return resp.data as assetGalleries;
        } catch(err){
            throw new Exception(`Unable to retrieve galleries for the website.`, err);
        }
    }

    async getGalleryById(guid: string, id: number){
        try{
            let apiPath = `/asset/gallery/${id}`;

            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);
            return resp.data as assetMediaGrouping
        } catch(err){
            throw new Exception(`Unable to retrieve gallery for id ${id}`, err);
        }
    }

    async getGalleryByName(guid: string, galleryName: string){
        try{
            let apiPath = `/asset/gallery?galleryName=${galleryName}`;

            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);
            return resp.data as assetMediaGrouping
        } catch(err){
            throw new Exception(`Unable to retrieve gallery for name ${galleryName}`, err);
        }
    }

    async getDefaultContainer(guid: string){
        try{
            let apiPath = `/asset/container`;

            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);
            return resp.data as assetContainer;
        } catch(err){
            throw new Exception(`Unable to retrieve container for guid ${guid}`, err);
        }
    }

    async saveGallery(guid: string, gallery: assetMediaGrouping){
        try{
            let apiPath = `/asset/gallery`;

            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, gallery);
            return resp.data as assetMediaGrouping;
        } catch(err){
            throw new Exception(`Unable to save gallery`, err);
        }
    }

    async deleteGallery(guid: string, id: number){
        try{
            let apiPath = `/asset/gallery/${id}`

            const resp = await this._clientInstance.executeDelete(apiPath, guid, this._options.token);
            return resp.data as string;
        } catch(err){
            throw new Exception(`Unable to delete gallery for id ${id}`, err);
        }
    }

    async getAssetByID(mediaID: number, guid: string){
        try{
          let apiPath = `asset/${mediaID}`;
          const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

          return resp.data as Media;
        } catch(err){
            throw new Exception(`Unable to retrieve asset for mediaID ${mediaID}`, err);
        }
    }

    async getAssetByUrl(url: string, guid: string){
        try{
            let apiPath = `asset?url=${url}`;
            const resp = await this._clientInstance.executeGet(apiPath, guid, this._options.token);

            return resp.data as Media;
        } catch(err){
            throw new Exception(`Unable to retrieve asset for url ${url}`, err);
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
            throw new Exception(`Unable to upload media.`, err);
        }
    }

    async createFolder(originKey: string, guid: string){
        try{
            let apiPath = `asset/folder?originKey=${originKey}`;
            const resp = await this._clientInstance.executePost(apiPath, guid, this._options.token, null);

            return resp.data as Media;
        } catch(err){
            throw new Exception('Unable to create folder.', err);
        }
    }
}