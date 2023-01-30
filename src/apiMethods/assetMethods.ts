import { Options } from "../models/options";
import { ClientInstance } from "./clientInstance";
import { AssetMediaList, Media } from "../models/media";
import { Exception } from "../models/exception";

export class AssetMethods{
    _options!: Options;
    _clientInstance!: ClientInstance;

    constructor(options: Options){
        this._options = options;
        this._clientInstance = new ClientInstance();
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

    async upload(formData: FormData, agilityFolderPath: string, guid: string, groupingID: number = -1){
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