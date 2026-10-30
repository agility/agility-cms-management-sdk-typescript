/** The order of a content list after `setContentListItemOrder`. */
export class ListItemOrderResult {
    /** Every item in the list, by content ID, in its new order. */
    contentIDs: number[];
    /** How many items had their order changed. 0 when the list was already in that order. */
    itemsUpdated: number;
}
