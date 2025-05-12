import { assetMediaGrouping } from "./assetMediaGrouping";

export interface assetGalleries {
    totalCount: number | null;
    assetMediaGroupings: (assetMediaGrouping | null)[];
} 