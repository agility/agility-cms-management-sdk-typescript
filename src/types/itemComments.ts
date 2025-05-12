export interface ItemComment {
    createdOn: string;
    createdBy: string;
    createdByUserID: number;
    createdByServerUserID: number;
    commentID: number;
    commentText: string;
    pinned: boolean;
    emailAddress: string;
}

export interface ItemComments {
    items: ItemComment[];
    totalCount: number;
} 