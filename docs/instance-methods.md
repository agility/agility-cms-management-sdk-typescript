# InstanceMethods API Documentation

The `InstanceMethods` class provides instance-level operations for retrieving configuration, settings, and sync status.

## Function List

| Function | Description |
|----------|-------------|
| [getLocales](#getlocales) | Retrieves all available locales for the instance |
| [getFetchApiStatus](#getfetchapistatus) | Gets the Fetch API CDN sync status for the instance |

---

## getLocales

Retrieves all available locales configured for the current Agility CMS instance.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| guid | string | Yes | The website GUID |

### Returns

`Promise<Locales[]>` - Array of locale objects with language configuration

### Usage Example

```typescript
const locales = await client.instanceMethods.getLocales('your-guid');

// Display available locales
locales.forEach(locale => {
  console.log(`${locale.name} (${locale.code})`);
});

// Find default locale
const defaultLocale = locales.find(locale => locale.isDefault);
console.log('Default locale:', defaultLocale.code);

// Get all enabled locales
const enabledLocales = locales.filter(locale => locale.isEnabled);
console.log(`${enabledLocales.length} locales are enabled`);
```

### Locale Object Structure

```typescript
interface Locales {
  code: string;           // Language code (e.g., 'en-us', 'fr-ca')
  name: string;           // Display name (e.g., 'English (United States)')
  isDefault: boolean;     // Whether this is the default locale
  isEnabled: boolean;     // Whether this locale is enabled
}
```

---

## getFetchApiStatus

Gets the Fetch API CDN sync status for an instance. Use this to check if changes made via the Management API have propagated to the Fetch API CDNs after batch operations or workflows.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| guid | string | Yes | The website GUID |
| mode | 'fetch' \| 'preview' | No | Sync mode: 'fetch' for live/published content, 'preview' for preview content. Defaults to 'fetch'. |
| waitForCompletion | boolean | No | If true, polls until sync is complete. Defaults to false. |

### Returns

`Promise<FetchApiStatus>` - The sync status object

### FetchApiStatus Interface

```typescript
interface FetchApiStatus {
  timestamp?: string;                    // Record timestamp
  completionTime?: string;               // When the sync completed
  errorMessage?: string;                 // Error message if sync failed
  inProgress: boolean;                   // Whether sync is currently in progress
  itemsAffected: number;                 // Number of items being synced (only available during sync)
  lastContentVersionID: number;          // Last content version ID synced
  lastDeletedContentVersionID: number;   // Last deleted content version ID synced
  lastDeletedPageVersionID: number;      // Last deleted page version ID synced
  leaseID?: string;                      // Lease ID for the sync operation
  maxChangeDate?: string;                // Maximum change date processed
  maxContentModelDate?: string;          // Maximum content model date processed
  pushType: number;                      // Push type (1 = Preview, 2 = Fetch/Live)
  startTime?: string;                    // When the sync started
  websiteName?: string;                  // The website name
}
```

> **Note:** The `itemsAffected` count is only meaningful while sync is in progress. It decreases as items are processed and reaches 0 when sync completes.

### Usage Examples

#### Check Current Sync Status

```typescript
const status = await client.instanceMethods.getFetchApiStatus('your-guid');

if (status.inProgress) {
  console.log('Fetch API sync is in progress...');
  console.log('Started at:', status.startTime);
} else {
  console.log('Fetch API sync is complete');
  console.log('Completed at:', status.completionTime);
}

// Check preview content sync status
const previewStatus = await client.instanceMethods.getFetchApiStatus('your-guid', 'preview');
console.log('Preview sync in progress:', previewStatus.inProgress);
```

#### Wait for Sync to Complete

```typescript
// After a batch publish, wait for CDN propagation
await client.batchMethods.publishBatch(batchId, guid);

console.log('Waiting for Fetch API sync to complete...');
const status = await client.instanceMethods.getFetchApiStatus(guid, 'fetch', true);
console.log('Sync complete!');
```

### Complete Workflow Example

```typescript
import * as mgmtApi from '@agility/management-sdk';

const options = new mgmtApi.Options();
options.token = 'your-access-token';
const client = new mgmtApi.ApiClient(options);

const guid = 'your-instance-guid';
const locale = 'en-us';

// Step 1: Perform a large batch publish operation
const contentIDs = [101, 102, 103, 104, 105];
await client.contentMethods.batchWorkflowContent(
  contentIDs, 
  guid, 
  locale, 
  mgmtApi.WorkflowOperationType.Publish
);
console.log('Batch publish submitted');

// Step 2: Wait for changes to propagate to CDN
console.log('Waiting for Fetch API sync...');
await client.instanceMethods.getFetchApiStatus(guid, 'fetch', true);
console.log('Sync complete! Content is now available on the CDN');
```

---

## Error Handling

All methods throw `Exception` objects on failure:

```typescript
try {
  const status = await client.instanceMethods.getFetchApiStatus('your-guid');
} catch (error) {
  console.error('Failed to get Fetch API status:', error.message);
}
```

---

## Navigation
- [← Back to Main Documentation](../README.md)
- [Authentication & Setup](./auth.md)
- [AssetMethods](./asset-methods.md)
- [BatchMethods](./batch-methods.md)
- [ContainerMethods](./container-methods.md)
- [ContentMethods](./content-methods.md)
- [InstanceUserMethods](./instance-user-methods.md)
- [ModelMethods](./model-methods.md)
- [PageMethods](./page-methods.md)
- [ServerUserMethods](./server-user-methods.md)
- [WebhookMethods](./webhook-methods.md)
