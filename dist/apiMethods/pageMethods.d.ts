import { Options } from "../models/options";
import { ClientInstance } from "./clientInstance";
import { PageItem } from "../models/pageItem";
import { Sitemap } from "../models/sitemap";
import { BatchMethods } from "./batchMethods";
export declare class PageMethods {
    _options: Options;
    _clientInstance: ClientInstance;
    _batchMethods: BatchMethods;
    constructor(options: Options);
    getSitemap(): Promise<Sitemap[]>;
    getPage(pageID: number): Promise<PageItem>;
    publishPage(pageID: number, comments?: string): Promise<number[]>;
    unPublishPage(pageID: number, comments?: string): Promise<number[]>;
    pageRequestApproval(pageID: number, comments?: string): Promise<number[]>;
    approvePage(pageID: number, comments?: string): Promise<number[]>;
    declinePage(pageID: number, comments?: string): Promise<number[]>;
    deletePage(pageID: number, comments?: string): Promise<number[]>;
    savePage(pageItem: PageItem, parentPageID?: number, placeBeforePageItemID?: number): Promise<number[]>;
}
