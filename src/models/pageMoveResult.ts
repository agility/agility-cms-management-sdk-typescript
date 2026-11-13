/** Where a page sits after `movePage`. */
export class PageMoveResult {
    /** The page that was moved. */
    pageID: number;
    /** The page's parent, or -1 at the root of its sitemap. */
    parentPageID: number;
    /** The page's latest version. Unchanged when the page didn't move. */
    versionID: number;
    /** False when the page was already in that place and nothing changed. */
    moved: boolean;
    /** The pages under the parent, in their order after the move, including this one. */
    siblingPageIDs: number[];
}
