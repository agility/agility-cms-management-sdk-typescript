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

    async deleteFile(mediaID: number){
        try{
          let apiPath = `asset/delete/${mediaID}`;
          const resp = await this._clientInstance.executeDelete(apiPath, this._options);;
          return resp.data as string;
        } catch(err){
            throw new Exception(`Unable to delete the media for mediaID: ${mediaID}`, err);
        }
    }

    async moveFile(mediaID: number, newFolder: string){
        try{
          let folder = encodeURIComponent(newFolder)
          let apiPath = `asset/move/${mediaID}?newFolder=${folder}`;

          const resp = await this._clientInstance.executePost(apiPath, this._options, null);
          return resp.data as Media;
        } catch(err){
            throw new Exception(`Unable to move the media for mediaID: ${mediaID}`, err);
        }
    }

    async getMediaList(pageSize: number, recordOffset: number){
        try{
            let apiPath = `asset/list?pageSize=${pageSize}&recordOffset=${recordOffset}`;

            const resp = await this._clientInstance.executeGet(apiPath, this._options);
            return resp.data as AssetMediaList;
        } catch(err){
            throw new Exception(`Unable to retrieve assets for the website.`, err);
        }
    }

    async getAssetByID(mediaID: number){
        try{
          let apiPath = `asset/${mediaID}`;
          const resp = await this._clientInstance.executeGet(apiPath, this._options);

          return resp.data as Media;
        } catch(err){
            throw new Exception(`Unable to retrieve asset for mediaID ${mediaID}`, err);
        }
    }

    async getAssetByUrl(url: string){
        try{
            let apiPath = `asset?url=${url}`;
            const resp = await this._clientInstance.executeGet(apiPath, this._options);

            return resp.data as Media;
        } catch(err){
            throw new Exception(`Unable to retrieve asset for url ${url}`, err);
        }
    }

    async upload(formData: FormData, agilityFolderPath: string, groupingID: number = -1){
        try{
            let apiPath = `asset/upload?folderPath=${agilityFolderPath}&groupingID=${groupingID}`;
            const resp = await this._clientInstance.executePost(apiPath, this._options, formData);
            
            return resp.data as Media[];
        } catch(err){
            throw new Exception(`Unable to upload media.`, err);
        }
    }
}