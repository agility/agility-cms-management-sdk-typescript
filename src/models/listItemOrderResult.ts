/** The order of a content list after `setContentListItemOrder`. */
export class ListItemOrderResult {
    /** Every item in the list, by content ID, in its new order. */
    contentIDs: number[];
    /** How many items had their order changed. 0 when the list was already in that order. */
    itemsUpdated: number;
    /** The items whose order changed, in their new order. */
    updatedContentIDs: number[];
    /** Requested IDs that weren't items in the list and were left out. Only with `skipUnknownIds`. */
    skippedContentIDs: number[];
}
