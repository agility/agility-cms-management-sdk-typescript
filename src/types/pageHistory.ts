export interface PageHistory {
    PageItemID: number;
    ContentItemID: number;
    StateID: number;
    State: string;
    CreatedDate: string;
    CreatedBy: string;
    CreatedByUserID: number;
    CreatedByUserEmail: string;
    CreatedByServerUserID: number;
    ReleaseDate: string;
    PullDate: string;
    CommentID: number;
    Comment: string;
    Pinned: boolean;
    VersionNumber: number;
}

export interface PageHistoryResponse {
    items: PageHistory[];
    totalCount: number;
} 