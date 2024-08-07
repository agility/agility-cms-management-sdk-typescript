export class ContentItemHistoryResponse {
    items: ContentItemHistory[];
    totalCount: number;
}

export class ContentItemHistory {
    contentItemID: number;
    stateID: number;
    state: string | null;
    createdDate: string;
    createdBy: string | null;
    createdByUserID: number;
    createdByServerUserID: number;
    createdByUserEmail: string | null;
    releaseDate: string;
    pullDate: string;
    commentID: number;
    comment: string | null;
    pinned: boolean;
    versionNumber: number;
}