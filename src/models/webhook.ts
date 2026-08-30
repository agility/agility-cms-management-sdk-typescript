export class Webhook {
    partitionKey: string | null;
    rowKey: string | null;
    timestamp?: string | null;
    eTag?: string | null;
    name: string | null;
    url: string | null;
    instanceGuid: string | null;
    enabled: boolean;
    contentWorkflowEvents: boolean;
    contentPublishEvents: boolean;
    contentSaveEvents: boolean;
    secureDeliveryEnabled: boolean;
    signingSecret: string | null;
    previousSigningSecret: string | null;
    secretRolledUtc: string | null;
    retriesEnabled: boolean;
    retryCount: number;
    retrySpeed: "fast" | "standard" | "slow" | null;
}
