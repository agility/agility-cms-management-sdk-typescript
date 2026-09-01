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
    /**
     * Set only on a `saveWebhook` response, and only when that save is what minted `signingSecret`
     * (the first save with `secureDeliveryEnabled` on). Use it to surface the new secret once — it is
     * never stored on the webhook, so a `getWebhook` response never has it.
     */
    signingSecretJustCreated?: boolean;
}
