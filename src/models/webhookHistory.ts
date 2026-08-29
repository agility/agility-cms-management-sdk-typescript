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
}
