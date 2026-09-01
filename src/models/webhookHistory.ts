export class WebhookHistory {
    partitionKey: string | null;
    rowKey: string | null;
    queuedDate: string | null;
    sendDate: string | null;
    url: string | null;
    instanceGuid: string | null;
    contentWorkflowEvent: boolean;
    contentPublishEvent: boolean;
    contentSaveEvent: boolean;
    payload: string | null;
    httpResponseCode: number | null;
    success: boolean;
    responseText: string | null;
    webhookRowKey: string | null;
    eventKey: string | null;
    attemptCount: number;
    lastAttemptDate: string | null;
    nextAttemptUtc: string | null;
    lastError: string | null;
    /**
     * Whether the last attempt was sent with Standard Webhooks signature headers, as recorded at send
     * time. `null` means no record — the delivery has not been attempted yet, or the row predates the
     * field. This is the fact at delivery time, not the webhook's current `secureDeliveryEnabled`.
     */
    signed: boolean | null;
    /**
     * Signatures sent in the `webhook-signature` header on the last attempt: 0 unsigned, 1 normally,
     * 2 during the 24-hour grace window after a secret roll.
     */
    signatureKeyCount: number;
}
