export class PageHistory {
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
    /** The page's parent in this version; -1 for a top-level page. */
    ParentPageID: number;
    /** The page's position among its siblings in this version. */
    PageHierarchyPosition: number;
}

export class PageHistoryResponse {
    items: PageHistory[];
    totalCount: number;
}