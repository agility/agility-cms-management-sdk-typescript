export interface BatchItem {
    batchItemID: number | null;
    batchID: number | null;
    itemTypeName: string;
    itemID: number;
    languageCode: string;
    processedItemVersionID: number | null;
    itemTitle: string;
    itemNull: boolean;
    createdOn: string;
    createdBy: number;
    createdByName: string;
}
