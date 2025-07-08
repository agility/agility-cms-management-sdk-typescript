# Agility CMS & Management API TypeScript SDK

## BatchMethods

This class provides essential batch workflow operations for managing content and page publishing workflows within Agility CMS. These methods handle workflow operations (publish, unpublish, approve, etc.) on existing batches.

**Important Notes:**
- To CREATE new content or pages, use `contentMethods.saveContentItem(s)` or `pageMethods.savePage()` instead
- These batch methods are for managing workflow operations on existing batches
- All batch operations support both immediate return and completion polling
- Use `getBatchTypes()` for dynamic UI population and validation

### Function List
- [getBatch](#getbatch) - Retrieves details of an existing batch
- [publishBatch](#publishbatch) - Publishes all items in an existing batch
- [unpublishBatch](#unpublishbatch) - Unpublishes all items in an existing batch
- [approveBatch](#approvebatch) - Approves all items in an existing batch
- [declineBatch](#declinebatch) - Declines all items in an existing batch
- [requestApprovalBatch](#requestapprovalbatch) - Requests approval for all items in an existing batch
- [getBatchTypes](#getbatchtypes) - Retrieves all batch-related enum types for developer discovery

---

### getBatch

Retrieves details of an existing batch including status, items, and metadata.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `batchID` | `number` | Yes | The batchID of the requested batch |
| `guid` | `string` | Yes | Current website GUID |
| `expandItems` | `boolean` | No | Whether to include full item details *(Optional, default: true)* |

**Returns:** `Batch` - Complete batch object with items and status information

**Usage Example:**
```typescript
// Get batch with full item details (default)
const batch = await apiClient.batchMethods.getBatch(123, guid);
console.log('Batch status:', batch.state);
console.log('Items in batch:', batch.items.length);

// Get basic batch information only (performance optimization)
const batchBasic = await apiClient.batchMethods.getBatch(123, guid, false);
```

**Error Handling:**
- Throws `Exception` when batch not found or access denied

### publishBatch

Publishes all items in an existing batch.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `batchID` | `number` | Yes | The batchID of the batch to publish |
| `guid` | `string` | Yes | Current website GUID |
| `returnBatchId` | `boolean` | No | If `true`, returns batch ID immediately. If `false` (default), waits for completion |

**Returns:** `number` - The batch ID

**Usage Example:**
```typescript
// Publish batch and wait for completion (default behavior)
const batchId = await apiClient.batchMethods.publishBatch(123, guid);
console.log('Batch published successfully:', batchId);

// Publish batch and return immediately for custom polling
const batchId = await apiClient.batchMethods.publishBatch(123, guid, true);
// You can then poll the batch status yourself
```

**Error Handling:**
- Throws `Exception` when batch not found, publishing fails, or insufficient permissions

### unpublishBatch

Unpublishes all items in an existing batch.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `batchID` | `number` | Yes | The batchID of the batch to unpublish |
| `guid` | `string` | Yes | Current website GUID |
| `returnBatchId` | `boolean` | No | If `true`, returns batch ID immediately. If `false` (default), waits for completion |

**Returns:** `number` - The batch ID

**Usage Example:**
```typescript
// Unpublish batch and wait for completion
const batchId = await apiClient.batchMethods.unpublishBatch(123, guid);

// Unpublish batch with immediate return
const batchId = await apiClient.batchMethods.unpublishBatch(123, guid, true);
```

**Error Handling:**
- Throws `Exception` when batch not found, unpublishing fails, or insufficient permissions

### approveBatch

Approves all items in an existing batch.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `batchID` | `number` | Yes | The batchID of the batch to approve |
| `guid` | `string` | Yes | Current website GUID |
| `returnBatchId` | `boolean` | No | If `true`, returns batch ID immediately. If `false` (default), waits for completion |

**Returns:** `number` - The batch ID

**Usage Example:**
```typescript
// Approve batch and wait for completion
const batchId = await apiClient.batchMethods.approveBatch(123, guid);

// Approve batch with immediate return for custom workflow
const batchId = await apiClient.batchMethods.approveBatch(123, guid, true);
```

**Error Handling:**
- Throws `Exception` when batch not found, approval fails, or insufficient permissions

### declineBatch

Declines all items in an existing batch.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `batchID` | `number` | Yes | The batchID of the batch to decline |
| `guid` | `string` | Yes | Current website GUID |
| `returnBatchId` | `boolean` | No | If `true`, returns batch ID immediately. If `false` (default), waits for completion |

**Returns:** `number` - The batch ID

**Usage Example:**
```typescript
// Decline batch and wait for completion
const batchId = await apiClient.batchMethods.declineBatch(123, guid);

// Decline batch with immediate return
const batchId = await apiClient.batchMethods.declineBatch(123, guid, true);
```

**Error Handling:**
- Throws `Exception` when batch not found, decline fails, or insufficient permissions

### requestApprovalBatch

Requests approval for all items in an existing batch.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `batchID` | `number` | Yes | The batchID of the batch to request approval for |
| `guid` | `string` | Yes | Current website GUID |
| `returnBatchId` | `boolean` | No | If `true`, returns batch ID immediately. If `false` (default), waits for completion |

**Returns:** `number` - The batch ID

**Usage Example:**
```typescript
// Request approval and wait for completion
const batchId = await apiClient.batchMethods.requestApprovalBatch(123, guid);

// Request approval with immediate return
const batchId = await apiClient.batchMethods.requestApprovalBatch(123, guid, true);
```

**Error Handling:**
- Throws `Exception` when batch not found, request fails, or insufficient permissions

### getBatchTypes

Retrieves all batch-related enum types for developer discovery and dynamic UI population.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `BatchTypesResponse` - Object containing all batch enum types

**Usage Example:**
```typescript
// Get all batch types for dynamic UI population
const types = await apiClient.batchMethods.getBatchTypes(guid);

// Create dropdown options for item types
const itemTypeOptions = types.itemTypes.map(type => ({
    label: type.name,
    value: type.value
}));

// Validate operation type
const isValidWorkflowOperation = (value) => 
    types.workflowOperations.some(op => op.value === value);

// Access specific enum data
console.log('Available item types:', types.itemTypes);
console.log('Available workflow operations:', types.workflowOperations);  
console.log('Available batch states:', types.states);
console.log('All operation types:', types.operationTypes);
```

**Response Structure:**
```typescript
interface BatchTypesResponse {
    itemTypes: EnumInfo[];         // Page, ContentItem, ContentList, Tag, ModuleDef
    operationTypes: EnumInfo[];    // All operation types 
    workflowOperations: EnumInfo[]; // Publish, Unpublish, Approve, Decline, RequestApproval
    states: EnumInfo[];            // None, Pending, InProcess, Processed, Deleted
}

interface EnumInfo {
    value: number;      // Numeric enum value
    name: string;       // String name (e.g., "Publish")
    description: string; // Human-readable description
}
```

**Benefits:**
- 🎨 **Dynamic UI Population** - Frontend dropdowns populate automatically
- ✅ **Client Validation** - Validate inputs against live API data
- 🔍 **API Discovery** - Explore options without reading docs
- 🚀 **Future-Proof** - New enum values appear automatically

**Error Handling:**
- Throws `Exception` when retrieval fails or access denied

---

## Navigation
- [← Back to Main Documentation](../README.md)
- [Authentication & Setup](./auth.md)
- [CI/CD & Automated Environments](./cicd.md)
- [AssetMethods](./asset-methods.md)
- [ContainerMethods](./container-methods.md)
- [ContentMethods](./content-methods.md)
- [InstanceMethods](./instance-methods.md)
- [InstanceUserMethods](./instance-user-methods.md)
- [ModelMethods](./model-methods.md)
- [PageMethods](./page-methods.md)
- [ServerUserMethods](./server-user-methods.md)
- [WebhookMethods](./webhook-methods.md)
- [Multi-Instance Operations](./multi-instance-operations.md) 