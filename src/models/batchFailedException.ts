import { Exception } from "./exception";
import { Batch } from "./batch";

export class BatchFailedItem {
    itemID: number;
    itemType: string;
    errorMessage: string;
}

/**
 * Thrown when a batch finishes processing but one or more of its items failed. The Management API
 * answers a save, publish or other batched operation with a batch ID before the work is done, and a
 * failed item doesn't change the HTTP status, so without this check a failed save looks like a
 * success.
 *
 * `failedItems` lists each failed item and its error, and `itemIDs` the items that succeeded. When the
 * batch can't say which item failed, `failedItems` is empty and the message carries the batch error.
 *
 * Methods that wrap their errors pass this through as `innerError`. Check with
 * `err instanceof BatchFailedException`, or `err.name === "BatchFailedException"` when more than one
 * copy of the SDK may be loaded.
 */
export class BatchFailedException extends Exception {
    batchID: number;
    failedItems: BatchFailedItem[];
    itemIDs: number[];

    constructor(batch: Batch, failedItems: BatchFailedItem[], detail: string) {
        super(`Batch ${batch.batchID} completed with errors: ${detail}`);
        // The SDK compiles to ES5, where a subclass of Error loses its prototype; restore it so
        // `instanceof BatchFailedException` works.
        Object.setPrototypeOf(this, BatchFailedException.prototype);
        this.name = "BatchFailedException";
        this.batchID = batch.batchID;
        this.failedItems = failedItems;
        const failedIDs = new Set(failedItems.map(f => f.itemID));
        this.itemIDs = (batch.items || []).map(i => i.itemID).filter(id => !failedIDs.has(id));
    }

    /**
     * Throws a BatchFailedException when a processed batch reports failed items, and does nothing when
     * it succeeded. A failure shows up as `errorData` (a JSON summary with `failureCount` and
     * `failedItems`, or plain text from older batch processors) or as an `errorMessage` on a batch item.
     */
    static throwIfFailed(batch: Batch) {
        const fromItems: BatchFailedItem[] = (batch.items || [])
            .filter(i => i.errorMessage)
            .map(i => ({ itemID: i.itemID, itemType: i.itemTypeName, errorMessage: BatchFailedException.itemError(i.errorMessage) }));

        let summary: any = null;
        if (batch.errorData) {
            try {
                summary = JSON.parse(batch.errorData);
            } catch {
                summary = { message: batch.errorData };
            }
        }

        const fromSummary: BatchFailedItem[] = Array.isArray(summary?.failedItems)
            ? summary.failedItems.map((f: any) => ({ itemID: f.itemId, itemType: f.itemType, errorMessage: f.errorMessage }))
            : [];

        const failed = fromSummary.length > 0 ? fromSummary : fromItems;
        const summaryFailed = summary != null && (typeof summary.failureCount === "number" ? summary.failureCount > 0 : true);
        if (failed.length === 0 && !summaryFailed) return;

        const detail = failed.length > 0
            ? failed.map(f => `${f.itemType ?? "item"} ${f.itemID}: ${f.errorMessage}`).join("; ")
            : (summary?.message ?? batch.errorData);
        throw new BatchFailedException(batch, failed, detail);
    }

    // A batch item's errorMessage is sometimes a JSON object with a `message` field.
    private static itemError(raw: string): string {
        try {
            const parsed = JSON.parse(raw);
            return typeof parsed?.message === "string" ? parsed.message : raw;
        } catch {
            return raw;
        }
    }
}
