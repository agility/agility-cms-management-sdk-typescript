export interface Media {
    hasChildren: boolean;
    mediaID: number;
    fileName: string;
    containerID: number;
    containerOriginUrl: string;
    containerEdgeUrl: string;
    originKey: string;
    modifiedBy: number | null;
    modifiedByName: string | null;
    dateModified: string | null;
    size: number;
    isFolder: boolean;
    isDeleted: boolean;
    mediaGroupingID: number;
    mediaGroupingName: string | null;
    mediaGroupingSortOrder: number;
    contentType: string;
    gridThumbnailID: number | null;
    gridThumbnailSuffix: string | null;
    rowNumber: number | null;
    originUrl: string;
    edgeUrl: string;
    isImage: boolean | null;
    isSvg: boolean | null;
}
export interface AssetMediaList {
    assetMedias: (Media | null)[];
    totalCount: number | null;
}
