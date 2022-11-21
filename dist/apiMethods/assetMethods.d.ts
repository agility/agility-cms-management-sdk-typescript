import { Options } from "../models/options";
import { ClientInstance } from "./clientInstance";
import { AssetMediaList, Media } from "../models/media";
export declare class AssetMethods {
    _options: Options;
    _clientInstance: ClientInstance;
    constructor(options: Options);
    deleteFile(mediaID: number): Promise<string>;
    moveFile(mediaID: number, newFolder: string): Promise<Media>;
    getMediaList(pageSize: number, recordOffset: number): Promise<AssetMediaList>;
    getAssetByID(mediaID: number): Promise<Media>;
    getAssetByUrl(url: string): Promise<Media>;
    upload(formData: FormData, agilityFolderPath: string, groupingID?: number): Promise<Media[]>;
}
