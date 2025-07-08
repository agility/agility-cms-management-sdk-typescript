# Agility CMS & Management API TypeScript SDK

## WebhookMethods

This class provides comprehensive webhook management operations for Agility CMS. Webhooks allow you to receive real-time notifications when specific events occur in your CMS, enabling integration with external systems and automated workflows.

**Important Notes:**
- Webhooks provide real-time event notifications to external endpoints
- Each webhook can be configured to trigger on specific events
- Webhooks support various event types (content changes, page updates, etc.)
- Webhook URLs must be accessible and return appropriate HTTP status codes
- Failed webhook deliveries are automatically retried with exponential backoff
- Webhooks can be secured with authentication headers or signatures

### Function List
- [getWebhook](#getwebhook) - Retrieves a specific webhook by ID
- [webhookList](#webhooklist) - Retrieves list of all webhooks
- [saveWebhook](#savewebhook) - Creates or updates a webhook
- [deleteWebhook](#deletewebhook) - Deletes a webhook by ID

---

### getWebhook

Retrieves a specific webhook by its unique ID.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `webhookID` | `number` | Yes | The webhook ID to retrieve |
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `Webhook` - Complete webhook object with configuration and statistics

**Usage Example:**
```typescript
const webhook = await apiClient.webhookMethods.getWebhook(123, guid);
console.log('Webhook name:', webhook.name);
console.log('Webhook URL:', webhook.url);
console.log('Events:', webhook.events);
console.log('Active:', webhook.isActive);
console.log('Created:', webhook.createdDate);
console.log('Last triggered:', webhook.lastTriggered);

// Display webhook statistics
if (webhook.statistics) {
    console.log('Statistics:');
    console.log(`  Total deliveries: ${webhook.statistics.totalDeliveries}`);
    console.log(`  Successful deliveries: ${webhook.statistics.successfulDeliveries}`);
    console.log(`  Failed deliveries: ${webhook.statistics.failedDeliveries}`);
    console.log(`  Success rate: ${webhook.statistics.successRate}%`);
}

// Display webhook configuration
console.log('Configuration:');
console.log(`  Method: ${webhook.method}`);
console.log(`  Content Type: ${webhook.contentType}`);
console.log(`  Timeout: ${webhook.timeout}ms`);
console.log(`  Retry count: ${webhook.retryCount}`);

// Check authentication
if (webhook.authentication) {
    console.log('Authentication enabled:');
    console.log(`  Type: ${webhook.authentication.type}`);
    console.log(`  Headers: ${Object.keys(webhook.authentication.headers).join(', ')}`);
} else {
    console.log('No authentication configured');
}
```

**Response Properties:**
The `Webhook` object includes:
- `webhookID`: Unique identifier for the webhook
- `name`: Human-readable name for the webhook
- `url`: Target URL for webhook deliveries
- `events`: Array of events that trigger the webhook
- `isActive`: Whether the webhook is active
- `method`: HTTP method (GET, POST, PUT, etc.)
- `contentType`: Content type for webhook payload
- `timeout`: Request timeout in milliseconds
- `retryCount`: Number of retry attempts for failed deliveries
- `authentication`: Authentication configuration
- `statistics`: Delivery statistics and metrics

**Error Handling:**
- Throws `Exception` when webhook not found

### webhookList

Retrieves a list of all webhooks in the current website.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `guid` | `string` | Yes | Current website GUID |
| `take` | `number` | No | Number of records to take (default: 20) |
| `token` | `string` | No | Token parameter (default: null) |

**Returns:** `any` - Array of all webhooks

**Usage Example:**
```typescript
const webhooks = await apiClient.webhookMethods.getWebhookList(guid);
console.log(`Total webhooks: ${webhooks.length}`);

// Display webhook summary
webhooks.forEach(webhook => {
    console.log(`Webhook: ${webhook.name}`);
    console.log(`  URL: ${webhook.url}`);
    console.log(`  Events: ${webhook.events.join(', ')}`);
    console.log(`  Active: ${webhook.isActive ? 'Yes' : 'No'}`);
    console.log(`  Last triggered: ${webhook.lastTriggered || 'Never'}`);
    console.log('---');
});

// Filter active webhooks
const activeWebhooks = webhooks.filter(w => w.isActive);
const inactiveWebhooks = webhooks.filter(w => !w.isActive);
console.log(`Active webhooks: ${activeWebhooks.length}`);
console.log(`Inactive webhooks: ${inactiveWebhooks.length}`);

// Group webhooks by event type
const webhooksByEvent = webhooks.reduce((acc, webhook) => {
    webhook.events.forEach(event => {
        if (!acc[event]) acc[event] = [];
        acc[event].push(webhook);
    });
    return acc;
}, {});

console.log('Webhooks by event:');
Object.entries(webhooksByEvent).forEach(([event, eventWebhooks]) => {
    console.log(`  ${event}: ${eventWebhooks.length} webhooks`);
});

// Find webhooks with high failure rates
const failingWebhooks = webhooks.filter(webhook => 
    webhook.statistics && webhook.statistics.successRate < 90
);
console.log(`Webhooks with high failure rate: ${failingWebhooks.length}`);

// Create webhook dropdown options
const webhookOptions = webhooks.map(webhook => ({
    value: webhook.webhookID,
    label: webhook.name,
    url: webhook.url,
    active: webhook.isActive
}));
```

**Common Webhook Events:**
- `content.created`: New content item created
- `content.updated`: Content item updated
- `content.deleted`: Content item deleted
- `content.published`: Content item published
- `content.unpublished`: Content item unpublished
- `page.created`: New page created
- `page.updated`: Page updated
- `page.deleted`: Page deleted
- `page.published`: Page published
- `page.unpublished`: Page unpublished
- `model.created`: Content model created
- `model.updated`: Content model updated
- `asset.uploaded`: Asset uploaded
- `asset.updated`: Asset updated

**Error Handling:**
- Throws `Exception` when retrieval fails

### saveWebhook

Creates a new webhook or updates an existing one.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `webhook` | `Webhook` | Yes | Webhook object to save |
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `Webhook` - Saved webhook object with updated metadata

**Usage Example:**
```typescript
// Create a new webhook
const newWebhook = {
    name: 'Content Update Notification',
    url: 'https://api.example.com/webhooks/agility-content',
    events: [
        'content.created',
        'content.updated',
        'content.published'
    ],
    isActive: true,
    method: 'POST',
    contentType: 'application/json',
    timeout: 30000,
    retryCount: 3,
    authentication: {
        type: 'header',
        headers: {
            'Authorization': 'Bearer your-api-token',
            'X-API-Key': 'your-api-key'
        }
    }
};

const savedWebhook = await apiClient.webhookMethods.saveWebhook(newWebhook, guid);
console.log('Webhook created with ID:', savedWebhook.webhookID);

// Update existing webhook
const existingWebhook = await apiClient.webhookMethods.getWebhook(123, guid);
existingWebhook.name = 'Updated Webhook Name';
existingWebhook.url = 'https://api.example.com/webhooks/updated-endpoint';
existingWebhook.events.push('page.published');

const updatedWebhook = await apiClient.webhookMethods.saveWebhook(existingWebhook, guid);
console.log('Webhook updated:', updatedWebhook.name);

// Create webhook with custom payload template
const customWebhook = {
    name: 'Custom Payload Webhook',
    url: 'https://api.example.com/webhooks/custom',
    events: ['content.published'],
    isActive: true,
    method: 'POST',
    contentType: 'application/json',
    timeout: 15000,
    retryCount: 2,
    payloadTemplate: {
        eventType: '{{event}}',
        timestamp: '{{timestamp}}',
        contentData: {
            id: '{{content.id}}',
            title: '{{content.title}}',
            referenceName: '{{content.referenceName}}'
        },
        customField: 'custom value'
    }
};

// Create webhook with signature verification
const secureWebhook = {
    name: 'Secure Webhook',
    url: 'https://api.example.com/webhooks/secure',
    events: ['content.created', 'content.updated'],
    isActive: true,
    method: 'POST',
    contentType: 'application/json',
    timeout: 30000,
    retryCount: 3,
    authentication: {
        type: 'signature',
        secret: 'your-webhook-secret',
        algorithm: 'sha256',
        headerName: 'X-Agility-Signature'
    }
};

// Bulk webhook operations
const createContentWebhooks = async (endpoints) => {
    const webhooks = [];
    for (const endpoint of endpoints) {
        const webhook = {
            name: `Content Webhook - ${endpoint.name}`,
            url: endpoint.url,
            events: ['content.created', 'content.updated', 'content.published'],
            isActive: true,
            method: 'POST',
            contentType: 'application/json',
            timeout: 30000,
            retryCount: 3
        };
        
        const saved = await apiClient.webhookMethods.saveWebhook(webhook, guid);
        webhooks.push(saved);
    }
    return webhooks;
};
```

**Webhook Structure:**
```typescript
interface Webhook {
    webhookID?: number;           // Auto-generated for new webhooks
    name: string;                 // Human-readable name (required)
    url: string;                  // Target URL (required)
    events: string[];             // Array of event types (required)
    isActive: boolean;            // Whether webhook is active
    method: string;               // HTTP method (GET, POST, PUT, etc.)
    contentType: string;          // Content type for payload
    timeout: number;              // Request timeout in milliseconds
    retryCount: number;           // Number of retry attempts
    authentication?: WebhookAuth; // Authentication configuration
    payloadTemplate?: any;        // Custom payload template
    statistics?: WebhookStats;    // Delivery statistics (read-only)
    createdDate?: string;         // Auto-generated
    lastTriggered?: string;       // Auto-generated
}

interface WebhookAuth {
    type: string;                 // 'header', 'signature', 'basic', etc.
    headers?: { [key: string]: string }; // Custom headers
    secret?: string;              // Secret for signature authentication
    algorithm?: string;           // Algorithm for signature (sha256, etc.)
    headerName?: string;          // Header name for signature
}

interface WebhookStats {
    totalDeliveries: number;      // Total delivery attempts
    successfulDeliveries: number; // Successful deliveries
    failedDeliveries: number;     // Failed deliveries
    successRate: number;          // Success rate percentage
    lastDeliveryDate: string;     // Last delivery attempt date
    lastSuccessDate: string;      // Last successful delivery date
}
```

**Authentication Types:**
- `header`: Custom headers for authentication
- `signature`: HMAC signature verification
- `basic`: Basic authentication
- `bearer`: Bearer token authentication
- `custom`: Custom authentication scheme

**Error Handling:**
- Throws `Exception` when validation fails (invalid URL, unsupported events, etc.)
- Throws `Exception` when save operation fails
- Throws `Exception` when authentication configuration is invalid

### deleteWebhook

Deletes a webhook by its ID.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `webhookID` | `number` | Yes | The webhook ID to delete |
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `string` - Confirmation message of successful deletion

**Usage Example:**
```typescript
try {
    const result = await apiClient.webhookMethods.deleteWebhook(123, guid);
    console.log(result); // "Webhook deleted successfully"
} catch (error) {
    console.error('Failed to delete webhook:', error.message);
}

// Safe webhook deletion with confirmation
const safeDeleteWebhook = async (webhookID) => {
    try {
        // Get webhook details first
        const webhook = await apiClient.webhookMethods.getWebhook(webhookID, guid);
        console.log(`About to delete webhook: ${webhook.name}`);
        console.log(`URL: ${webhook.url}`);
        console.log(`Events: ${webhook.events.join(', ')}`);
        
        // Check if webhook is active
        if (webhook.isActive) {
            console.log('Warning: Deleting active webhook');
        }
        
        // Perform deletion
        const result = await apiClient.webhookMethods.deleteWebhook(webhookID, guid);
        console.log('Webhook deleted successfully');
        return result;
    } catch (error) {
        console.error('Failed to delete webhook:', error.message);
        throw error;
    }
};

// Bulk cleanup of inactive webhooks
const cleanupInactiveWebhooks = async () => {
    const webhooks = await apiClient.webhookMethods.getWebhookList(guid);
    const inactiveWebhooks = webhooks.filter(w => !w.isActive);
    
    console.log(`Found ${inactiveWebhooks.length} inactive webhooks`);
    
    for (const webhook of inactiveWebhooks) {
        const shouldDelete = confirm(
            `Delete inactive webhook "${webhook.name}"? (${webhook.url})`
        );
        
        if (shouldDelete) {
            await apiClient.webhookMethods.deleteWebhook(webhook.webhookID, guid);
            console.log(`Deleted webhook: ${webhook.name}`);
        }
    }
};

// Delete webhooks with high failure rates
const cleanupFailingWebhooks = async (maxFailureRate = 50) => {
    const webhooks = await apiClient.webhookMethods.getWebhookList(guid);
    
    const failingWebhooks = webhooks.filter(webhook => 
        webhook.statistics && 
        webhook.statistics.successRate < maxFailureRate &&
        webhook.statistics.totalDeliveries > 10 // Only consider webhooks with sufficient data
    );
    
    console.log(`Found ${failingWebhooks.length} webhooks with high failure rate`);
    
    for (const webhook of failingWebhooks) {
        console.log(`Webhook "${webhook.name}" has ${webhook.statistics.successRate}% success rate`);
        
        const shouldDelete = confirm(
            `Delete failing webhook "${webhook.name}"? (Success rate: ${webhook.statistics.successRate}%)`
        );
        
        if (shouldDelete) {
            await apiClient.webhookMethods.deleteWebhook(webhook.webhookID, guid);
            console.log(`Deleted failing webhook: ${webhook.name}`);
        }
    }
};
```

**Deletion Considerations:**
- Deleting a webhook immediately stops all future event deliveries
- Pending webhook deliveries may still be processed
- Webhook statistics and history are permanently lost
- Consider deactivating instead of deleting for temporary suspension

**Best Practices:**
- Test webhook endpoints before creating webhooks
- Use appropriate authentication to secure webhook endpoints
- Monitor webhook statistics and success rates
- Implement proper error handling in webhook receivers
- Use webhook signatures to verify authenticity
- Set reasonable timeout values to avoid blocking
- Consider implementing idempotency in webhook receivers

**Error Handling:**
- Throws `Exception` when webhook not found
- Throws `Exception` when deletion fails
- Throws `Exception` when insufficient permissions to delete webhooks

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
- [ServerUserMethods](./server-user-methods.md)
- **WebhookMethods** *(current)* 