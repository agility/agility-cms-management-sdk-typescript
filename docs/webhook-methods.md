# Agility CMS & Management API TypeScript SDK

## WebhookMethods

This class provides webhook management operations for Agility CMS. Webhooks deliver real-time HTTP POST notifications to your endpoints when content is saved, published, or moved through workflow, enabling integration with external systems and automated builds.

**Important Notes:**
- Webhooks fire on three event categories: content save, content publish, and content workflow events — each can be toggled per webhook
- Webhook IDs are string GUIDs (the `rowKey` of the stored record), not numbers
- Signed delivery is **opt-in per webhook** (`secureDeliveryEnabled`, off by default): when enabled, deliveries carry [Standard Webhooks](https://www.standardwebhooks.com/) signature headers — see [Verifying deliveries](#verifying-deliveries-signing) below. Webhooks with it off (including every webhook created before the feature shipped) are delivered unsigned, exactly as before
- List responses never include signing secrets; `getWebhook` masks the signing secret unless the caller has *Manage* permission on webhooks
- Rotating a signing secret requires *FullControl* permission; reading delivery history requires *Manage* permission
- Failed deliveries are retried automatically when retries are enabled — see [Retry behavior](#retry-behavior)

### Function List
- [webhookList](#webhooklist) - Retrieves a paged list of webhooks
- [getWebhook](#getwebhook) - Retrieves a specific webhook by ID
- [saveWebhook](#savewebhook) - Creates or updates a webhook
- [deleteWebhook](#deletewebhook) - Deletes a webhook by ID
- [getWebhookHistory](#getwebhookhistory) - Retrieves the delivery history for a webhook
- [rotateWebhookSecret](#rotatewebhooksecret) - Rotates a webhook's signing secret

### Reference
- [The Webhook object](#the-webhook-object)
- [Verifying deliveries (signing)](#verifying-deliveries-signing)
- [Retry behavior](#retry-behavior)

---

### webhookList

Retrieves a paged list of webhooks for the instance. Uses continuation-token paging: pass the `token` from a previous response to fetch the next page. Signing secrets are always stripped from list responses.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `guid` | `string` | Yes | Current website GUID |
| `take` | `number` | No | Number of records to take (default: 20) |
| `token` | `string` | No | Continuation token from a previous response (default: null) |

**Returns:** `TokenPagedResult<Webhook>` - `{ token, items }` where `token` is the continuation token for the next page (or null when there are no more results) and `items` is the array of webhooks

**Usage Example:**
```typescript
// First page
let page = await apiClient.webhookMethods.webhookList(guid, 20);
page.items.forEach(webhook => {
    console.log(`${webhook.name} -> ${webhook.url} (enabled: ${webhook.enabled})`);
});

// Fetch all pages
const allWebhooks = [...page.items];
while (page.token) {
    page = await apiClient.webhookMethods.webhookList(guid, 20, page.token);
    allWebhooks.push(...page.items);
}
console.log(`Total webhooks: ${allWebhooks.length}`);
```

**Error Handling:**
- Throws `Exception` when retrieval fails

### getWebhook

Retrieves a specific webhook by its ID (the `rowKey` GUID).

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `guid` | `string` | Yes | Current website GUID |
| `webhookID` | `string` | Yes | The webhook ID (`rowKey`) to retrieve |

**Returns:** `Webhook` - The webhook object. The `signingSecret` is masked unless the caller has *Manage* permission on webhooks.

**Usage Example:**
```typescript
const webhook = await apiClient.webhookMethods.getWebhook(guid, webhookID);
console.log('Webhook name:', webhook.name);
console.log('Webhook URL:', webhook.url);
console.log('Enabled:', webhook.enabled);
console.log('Events:', {
    save: webhook.contentSaveEvents,
    publish: webhook.contentPublishEvents,
    workflow: webhook.contentWorkflowEvents
});
console.log('Retries:', webhook.retriesEnabled
    ? `${webhook.retryCount} retries at ${webhook.retrySpeed} speed`
    : 'disabled');
```

**Error Handling:**
- Throws `Exception` when the webhook is not found or retrieval fails

### saveWebhook

Creates a new webhook or updates an existing one.

**To update an existing webhook, the `partitionKey` and `rowKey` from a previously retrieved webhook must be present on the object** — without them the API treats the save as a create and mints a new webhook. The easiest pattern is get → modify → save.

Signed delivery is opt-in per webhook: set `secureDeliveryEnabled: true` and the server mints a signing secret on that save (webhooks with it off — including every webhook created before this feature — are delivered unsigned, exactly as before). Any `signingSecret` value you send is ignored; secrets are always server-controlled. Use [rotateWebhookSecret](#rotatewebhooksecret) to change one.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `guid` | `string` | Yes | Current website GUID |
| `webhook` | `Webhook` | Yes | Webhook object to save |

**Returns:** `Webhook` - The saved webhook object

**Usage Example:**
```typescript
import { Webhook } from '@agility/management-sdk';

// Create a new webhook
const webhook = new Webhook();
webhook.name = 'Content Publish Notification';
webhook.url = 'https://api.example.com/webhooks/agility';
webhook.enabled = true;
webhook.contentSaveEvents = false;
webhook.contentPublishEvents = true;
webhook.contentWorkflowEvents = false;
webhook.retriesEnabled = true;
webhook.retryCount = 5;
webhook.retrySpeed = 'standard';

const saved = await apiClient.webhookMethods.saveWebhook(guid, webhook);
console.log('Webhook created with ID:', saved.rowKey);

// Update an existing webhook (partitionKey/rowKey carry through from the get)
const existing = await apiClient.webhookMethods.getWebhook(guid, saved.rowKey);
existing.name = 'Updated Webhook Name';
existing.contentWorkflowEvents = true;

const updated = await apiClient.webhookMethods.saveWebhook(guid, existing);
console.log('Webhook updated:', updated.name);
```

**Error Handling:**
- Throws `Exception` when validation or the save operation fails

### deleteWebhook

Deletes a webhook by its ID. Deletion immediately stops future deliveries for that webhook.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `guid` | `string` | Yes | Current website GUID |
| `webhookID` | `string` | Yes | The webhook ID (`rowKey`) to delete |

**Returns:** `void`

**Usage Example:**
```typescript
await apiClient.webhookMethods.deleteWebhook(guid, webhookID);
console.log('Webhook deleted');
```

**Error Handling:**
- Throws `Exception` when the webhook is not found or deletion fails

### getWebhookHistory

Retrieves the delivery history for a webhook — one record per event delivery, including the payload, HTTP response, and retry state. Requires *Manage* permission on webhooks.

Dates are UTC dates. The date range may span at most **31 days**; when no range is given, the **last 7 days** are returned. `take` is capped at **100** per page; use the continuation `token` for more.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `guid` | `string` | Yes | Current website GUID |
| `webhookID` | `string` | Yes | The webhook ID (`rowKey`) whose history to retrieve |
| `options` | `object` | No | Optional query options (below) |
| `options.fromDate` | `string` | No | UTC start date (e.g. `2026-08-01`) |
| `options.toDate` | `string` | No | UTC end date; range max 31 days |
| `options.take` | `number` | No | Records per page, max 100 |
| `options.token` | `string` | No | Continuation token from a previous response |

**Returns:** `TokenPagedResult<WebhookHistory>` - `{ token, items }` with the continuation token and the history records

**Usage Example:**
```typescript
// Last 7 days (default)
const history = await apiClient.webhookMethods.getWebhookHistory(guid, webhookID);
history.items.forEach(entry => {
    console.log(`${entry.sendDate} -> HTTP ${entry.httpResponseCode} (success: ${entry.success})`);
    if (!entry.success) {
        console.log(`  attempts: ${entry.attemptCount}, next attempt: ${entry.nextAttemptUtc}`);
        console.log(`  last error: ${entry.lastError}`);
    }
});

// A specific window, paging through all records
let page = await apiClient.webhookMethods.getWebhookHistory(guid, webhookID, {
    fromDate: '2026-08-01',
    toDate: '2026-08-15',
    take: 100
});
const failures = page.items.filter(e => !e.success);
while (page.token) {
    page = await apiClient.webhookMethods.getWebhookHistory(guid, webhookID, {
        fromDate: '2026-08-01',
        toDate: '2026-08-15',
        take: 100,
        token: page.token
    });
    failures.push(...page.items.filter(e => !e.success));
}
console.log(`Failed deliveries in window: ${failures.length}`);
```

**WebhookHistory Properties:**
- `partitionKey` / `rowKey`: Storage identity of the history record. **`rowKey` is the value sent as the `webhook-id` header**, so use it to correlate a history record with what your endpoint received
- `webhookRowKey`: The ID of the webhook this delivery belongs to
- `eventKey`: Identifier of the triggering *event*, shared by every webhook that received it (used server-side for de-duplication). This is **not** the `webhook-id` header — correlate with `rowKey` instead
- `queuedDate` / `sendDate`: When the delivery was queued and sent
- `url`: The URL the payload was POSTed to
- `instanceGuid`: The instance the event originated from
- `contentSaveEvent` / `contentPublishEvent` / `contentWorkflowEvent`: Which event category fired
- `payload`: The JSON payload that was sent
- `httpResponseCode` / `success` / `responseText`: The endpoint's response (any 2xx counts as success)
- `attemptCount` / `lastAttemptDate` / `nextAttemptUtc` / `lastError`: Retry state for failed deliveries

**Error Handling:**
- Throws `Exception` when retrieval fails (including insufficient permissions or an invalid date range)

### rotateWebhookSecret

Rotates the webhook's signing secret. Requires *FullControl* permission on webhooks.

The response is the only place the new secret is returned in full — store it immediately. The previous secret is kept as `previousSigningSecret` so deliveries signed during the rollover window can still be verified; update your endpoint to the new secret promptly.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `guid` | `string` | Yes | Current website GUID |
| `webhookID` | `string` | Yes | The webhook ID (`rowKey`) whose secret to rotate |

**Returns:** `Webhook` - The webhook with the new, unmasked `signingSecret`, the old secret in `previousSigningSecret`, and `secretRolledUtc` set to the rotation time

**Usage Example:**
```typescript
const rotated = await apiClient.webhookMethods.rotateWebhookSecret(guid, webhookID);
console.log('New signing secret:', rotated.signingSecret); // whsec_...
console.log('Rotated at:', rotated.secretRolledUtc);

// Store the new secret in your secret manager, then update your endpoint's verifier.
```

**Error Handling:**
- Throws `Exception` when rotation fails (including insufficient permissions)

---

## The Webhook object

```typescript
class Webhook {
    partitionKey: string | null;      // Storage identity — required (with rowKey) to update an existing webhook
    rowKey: string | null;            // The webhook's ID (GUID); used as webhookID in the other methods
    timestamp?: string | null;        // Storage timestamp (read-only)
    eTag?: string | null;             // Storage ETag (read-only)
    name: string | null;              // Human-readable name
    url: string | null;               // Target URL for deliveries
    instanceGuid: string | null;      // Instance the webhook belongs to
    enabled: boolean;                 // Whether the webhook fires at all
    contentWorkflowEvents: boolean;   // Fire on workflow events (request approval, approve, decline)
    contentPublishEvents: boolean;    // Fire on publish/unpublish events
    contentSaveEvents: boolean;       // Fire on save/delete events
    secureDeliveryEnabled: boolean;   // Opt-in for signed delivery (default false; existing webhooks stay unsigned)
    signingSecret: string | null;     // Standard Webhooks secret (whsec_...) — server-controlled, masked without Manage permission
    previousSigningSecret: string | null; // Prior secret, kept for the rotation rollover window
    secretRolledUtc: string | null;   // When the secret was last rotated
    retriesEnabled: boolean;          // Whether failed deliveries are retried
    retryCount: number;               // Retries after the initial attempt (1-8)
    retrySpeed: "fast" | "standard" | "slow" | null; // Base retry delay tier
}
```

## Verifying deliveries (signing)

Deliveries for a webhook with `secureDeliveryEnabled: true` are signed per the [Standard Webhooks](https://www.standardwebhooks.com/) specification; those carry three extra headers. Deliveries for webhooks without it carry no signature headers at all, so verify signatures only for endpoints you have enabled secure delivery on:

| Header | Description |
|--------|-------------|
| `webhook-id` | Unique ID of this delivery (the history record's `rowKey`) — reuse it as an **idempotency key**, since retries resend the same `webhook-id` |
| `webhook-timestamp` | Unix timestamp (seconds) of the delivery attempt |
| `webhook-signature` | `v1,<base64 signature>` — HMAC-SHA256 over `{id}.{timestamp}.{body}` keyed with the decoded secret |

The signing secret is the webhook's `signingSecret` (`whsec_` followed by the base64-encoded key). Verify with any Standard Webhooks library rather than hand-rolling the HMAC:

```typescript
import { Webhook as StandardWebhook } from 'standardwebhooks';

const verifier = new StandardWebhook(process.env.AGILITY_WEBHOOK_SECRET); // whsec_...

app.post('/webhooks/agility', (req, res) => {
    try {
        // verify() checks the signature AND enforces the timestamp tolerance
        const payload = verifier.verify(req.rawBody, req.headers);

        // Use webhook-id for idempotency — retries resend the same id
        if (alreadyProcessed(req.headers['webhook-id'])) {
            return res.sendStatus(200);
        }

        processEvent(payload);
        res.sendStatus(200); // any 2xx marks the delivery successful
    } catch {
        res.sendStatus(401);
    }
});
```

**Verification rules:**
- Reject deliveries whose `webhook-timestamp` is more than **5 minutes** from now (standard libraries enforce this) — this bounds replay attacks
- During a secret rotation, accept signatures from either the new secret or `previousSigningSecret`
- Respond with a **2xx** status to acknowledge; anything else (or a timeout) counts as a failure and triggers retries when enabled

## Retry behavior

Retries apply per delivery and are configured on the webhook:

- `retriesEnabled` — master switch; when false, one attempt is made and failures are recorded but never retried
- `retryCount` — how many retries are made **after the initial attempt**, from 1 to 8
- `retrySpeed` — the base delay before the first retry:

| Speed | Base delay |
|-------|-----------|
| `fast` | 30 seconds |
| `standard` | 5 minutes |
| `slow` | 30 minutes |

Each subsequent retry backs off exponentially at **×4** the previous delay, with jitter, capped at **24 hours** between attempts. For example, `standard` retries land at roughly 5m, 20m, 80m, ... after the failure.

A delivery is successful as soon as the endpoint returns any **2xx** response; success stops the retry chain. Retry state for a delivery is visible in [getWebhookHistory](#getwebhookhistory) via `attemptCount`, `lastAttemptDate`, `nextAttemptUtc`, and `lastError`.

---

## Navigation
- [← Back to Main Documentation](../README.md)
- [Authentication & Setup](./auth.md)
- [AssetMethods](./asset-methods.md)
- [BatchMethods](./batch-methods.md)
- [ContainerMethods](./container-methods.md)
- [ContentMethods](./content-methods.md)
- [InstanceMethods](./instance-methods.md)
- [InstanceUserMethods](./instance-user-methods.md)
- [ModelMethods](./model-methods.md)
- [PageMethods](./page-methods.md)
- [ServerUserMethods](./server-user-methods.md)
- **WebhookMethods** *(current)*
