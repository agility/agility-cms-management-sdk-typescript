export class Webhook {
    name: string | null;
    url: string | null;
    instanceGuid: string | null;
    enabled: boolean;
    contentWorkflowEvents: boolean;
    contentPublishEvents: boolean;
    contentSaveEvents: boolean;
}