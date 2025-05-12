import { AssetGroupingType } from "../enums/assetGroupingType";
import { assetMediaGroupingMetaData } from "./assetMediaGroupingMetaData";

export interface assetMediaGrouping {
    mediaGroupingID: number | null;
    groupingType: AssetGroupingType | null;
    groupingTypeID: number | null;
    name: string | null;
    description: string | null;
    modifiedBy: number | null;
    modifiedByName: string | null;
    modifiedOn: string | null;
    isDeleted: boolean;
    isFolder: boolean;
    metaData: { [key: string]: assetMediaGroupingMetaData; };
} 