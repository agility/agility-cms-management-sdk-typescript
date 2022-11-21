import { Options } from "../models/options";
import { ClientInstance } from "./clientInstance";
import { ContentItem } from "../models/contentItem";
import { BatchMethods } from "./batchMethods";
export declare class ContentMethods {
    _options: Options;
    _clientInstance: ClientInstance;
    _batchMethods: BatchMethods;
    constructor(options: Options);
    getContentItem(contentID: number): Promise<ContentItem>;
    publishContent(contentID: number, comments?: string): Promise<number[]>;
    unPublishContent(contentID: number, comments?: string): Promise<number[]>;
    contentRequestApproval(contentID: number, comments?: string): Promise<number[]>;
    approveContent(contentID: number, comments?: string): Promise<number[]>;
    declineContent(contentID: number, comments?: string): Promise<number[]>;
    deleteContent(contentID: number, comments?: string): Promise<number[]>;
    saveContentItem(contentItem: ContentItem): Promise<number[]>;
    saveContentItems(contentItems: ContentItem[]): Promise<number[]>;
}
