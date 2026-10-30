# ContentMethods API Documentation

The `ContentMethods` class provides comprehensive functionality for managing content items, including creation, publication, approval workflows, and retrieval operations.

## Function List

| Function | Description |
|----------|-------------|
| [getContentItem](#getcontentitem) | Retrieves a specific content item by ID |
| [publishContent](#publishcontent) | Publishes a content item |
| [unPublishContent](#unpublishcontent) | Unpublishes a content item |
| [batchWorkflowContent](#batchworkflowcontent) | Batch workflow operation on multiple content items |
| [contentRequestApproval](#contentrequestapproval) | Requests approval for a content item |
| [approveContent](#approvecontent) | Approves a content item |
| [declineContent](#declinecontent) | Declines a content item |
| [deleteContent](#deletecontent) | Deletes a content item |
| [saveContentItem](#savecontentitem) | Saves a single content item |
| [saveContentItems](#savecontentitems) | Saves multiple content items |
| [getContentItems](#getcontentitems) | Retrieves content items with filtering (deprecated) |
| [getContentList](#getcontentlist) | Retrieves content list with advanced filtering |
| [setContentListItemOrder](#setcontentlistitemorder) | Puts the items of a content list in a given order |
| [getContentHistory](#getcontenthistory) | Retrieves content item history |
| [getContentComments](#getcontentcomments) | Retrieves content item comments |

---

## getContentItem

Retrieves a specific content item by ID and locale.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| contentID | number | Yes | The ID of the content item to retrieve |
| guid | string | Yes | The website GUID |
| locale | string | Yes | The locale code (e.g., 'en-us') |

### Returns

`Promise<ContentItem>` - The content item object

### Usage Example

```typescript
const contentItem = await client.contentMethods.getContentItem(123, 'your-guid', 'en-us');
console.log(contentItem.fields.title);
```

---

## publishContent

Publishes a content item through the batch workflow system.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| contentID | number | Yes | The ID of the content item to publish |
| guid | string | Yes | The website GUID |
| locale | string | Yes | The locale code |
| comments | string | No | Optional comments for the publish operation |
| returnBatchId | boolean | No | If true, returns batch ID immediately without waiting |

### Returns

`Promise<number[]>` - Array of content IDs that were published

### Usage Example

```typescript
// Wait for completion (default)
const publishedIds = await client.contentMethods.publishContent(123, 'your-guid', 'en-us', 'Publishing update');

// Return batch ID immediately for custom polling
const batchId = await client.contentMethods.publishContent(123, 'your-guid', 'en-us', null, true);
```

---

## unPublishContent

Unpublishes a content item through the batch workflow system.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| contentID | number | Yes | The ID of the content item to unpublish |
| guid | string | Yes | The website GUID |
| locale | string | Yes | The locale code |
| comments | string | No | Optional comments for the unpublish operation |
| returnBatchId | boolean | No | If true, returns batch ID immediately without waiting |

### Returns

`Promise<number[]>` - Array of content IDs that were unpublished

### Usage Example

```typescript
const unpublishedIds = await client.contentMethods.unPublishContent(123, 'your-guid', 'en-us', 'Temporary unpublish');
```

---

## batchWorkflowContent

Performs a batch workflow operation on multiple content items. Supports Publish, Unpublish, Approve, Decline, and RequestApproval operations.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| contentIDs | number[] | Yes | Array of content IDs to process |
| guid | string | Yes | The website GUID |
| locale | string | Yes | The locale code |
| operation | WorkflowOperationType | Yes | The workflow operation (Publish, Unpublish, Approve, Decline, RequestApproval) |
| returnBatchId | boolean | No | If true, returns batch ID immediately without waiting |

### Returns

`Promise<number[]>` - Array of content IDs that were processed

### Usage Example

```typescript
import { WorkflowOperationType } from '@agility/management-sdk';

// Publish multiple content items
const contentIDs = [101, 102, 103];
const publishedIds = await client.contentMethods.batchWorkflowContent(
    contentIDs, 
    'your-guid', 
    'en-us', 
    WorkflowOperationType.Publish
);
console.log('Published content IDs:', publishedIds);

// Unpublish multiple content items
const unpublishedIds = await client.contentMethods.batchWorkflowContent(
    contentIDs, 
    'your-guid', 
    'en-us', 
    WorkflowOperationType.Unpublish
);

// Request approval for multiple content items
const approvalRequestedIds = await client.contentMethods.batchWorkflowContent(
    contentIDs, 
    'your-guid', 
    'en-us', 
    WorkflowOperationType.RequestApproval
);

// Approve multiple content items
const approvedIds = await client.contentMethods.batchWorkflowContent(
    contentIDs, 
    'your-guid', 
    'en-us', 
    WorkflowOperationType.Approve
);

// Decline multiple content items
const declinedIds = await client.contentMethods.batchWorkflowContent(
    contentIDs, 
    'your-guid', 
    'en-us', 
    WorkflowOperationType.Decline
);
```

---

## contentRequestApproval

Requests approval for a content item through the workflow system.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| contentID | number | Yes | The ID of the content item |
| guid | string | Yes | The website GUID |
| locale | string | Yes | The locale code |
| comments | string | No | Optional comments for the approval request |
| returnBatchId | boolean | No | If true, returns batch ID immediately without waiting |

### Returns

`Promise<number[]>` - Array of content IDs that had approval requested

### Usage Example

```typescript
const requestedIds = await client.contentMethods.contentRequestApproval(123, 'your-guid', 'en-us', 'Ready for review');
```

---

## approveContent

Approves a content item in the workflow system.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| contentID | number | Yes | The ID of the content item to approve |
| guid | string | Yes | The website GUID |
| locale | string | Yes | The locale code |
| comments | string | No | Optional comments for the approval |
| returnBatchId | boolean | No | If true, returns batch ID immediately without waiting |

### Returns

`Promise<number[]>` - Array of content IDs that were approved

### Usage Example

```typescript
const approvedIds = await client.contentMethods.approveContent(123, 'your-guid', 'en-us', 'Approved for publication');
```

---

## declineContent

Declines a content item in the workflow system.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| contentID | number | Yes | The ID of the content item to decline |
| guid | string | Yes | The website GUID |
| locale | string | Yes | The locale code |
| comments | string | No | Optional comments for the decline |
| returnBatchId | boolean | No | If true, returns batch ID immediately without waiting |

### Returns

`Promise<number[]>` - Array of content IDs that were declined

### Usage Example

```typescript
const declinedIds = await client.contentMethods.declineContent(123, 'your-guid', 'en-us', 'Needs revision');
```

---

## deleteContent

Deletes a content item through the batch workflow system.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| contentID | number | Yes | The ID of the content item to delete |
| guid | string | Yes | The website GUID |
| locale | string | Yes | The locale code |
| comments | string | No | Optional comments for the deletion |
| returnBatchId | boolean | No | If true, returns batch ID immediately without waiting |

### Returns

`Promise<number[]>` - Array of content IDs that were deleted

### Usage Example

```typescript
const deletedIds = await client.contentMethods.deleteContent(123, 'your-guid', 'en-us', 'Removing outdated content');
```

---

## saveContentItem

Saves a single content item (create or update) through the batch workflow system.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| contentItem | ContentItem | Yes | The content item object to save |
| guid | string | Yes | The website GUID |
| locale | string | Yes | The locale code |
| returnBatchId | boolean | No | If true, returns batch ID immediately without waiting |

### Returns

`Promise<number[]>` - Array of content IDs that were saved

### Usage Example

```typescript
const contentItem = {
  contentID: 0, // 0 for new items
  fields: {
    title: 'New Article',
    content: 'Article content...'
  }
};

const savedIds = await client.contentMethods.saveContentItem(contentItem, 'your-guid', 'en-us');
```

---

## saveContentItems

Saves multiple content items in a single batch operation.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| contentItems | ContentItem[] | Yes | Array of content item objects to save |
| guid | string | Yes | The website GUID |
| locale | string | Yes | The locale code |
| returnBatchId | boolean | No | If true, returns batch ID immediately without waiting |

### Returns

`Promise<number[]>` - Array of content IDs that were saved

### Usage Example

```typescript
const contentItems = [
  { contentID: 0, fields: { title: 'Article 1' } },
  { contentID: 0, fields: { title: 'Article 2' } }
];

const savedIds = await client.contentMethods.saveContentItems(contentItems, 'your-guid', 'en-us');
```

### GEO / AEO on dynamic page list items

An item in a list that backs a dynamic page can carry a top-level `geo` object (`schemaType`, `summary`, `structuredData`, `ai`), the same shape as a page's `geo` (see [savePage](./page-methods.md#savepage)). `saveContentItem` and `saveContentItems` send it as given, with the same three states: leave `geo` (or a property in it) out to keep what's stored, set a property to `null` to clear it, send `geo: null` to clear the whole block. Items in other lists don't carry `geo`, and `getContentItem` leaves it out when the item has none.

```typescript
const item = await client.contentMethods.getContentItem(123, 'your-guid', 'en-us');
item.geo = { ...item.geo, summary: 'The post in one sentence.', ai: { crawl: 'block' } };
await client.contentMethods.saveContentItem(item, 'your-guid', 'en-us');
```

---

## getContentItems

Retrieves content items with basic filtering parameters (deprecated - use getContentList instead).

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| referenceName | string | Yes | The reference name of the content model |
| guid | string | Yes | The website GUID |
| locale | string | Yes | The locale code |
| listParams | ListParams | Yes | Pagination and filtering parameters |

### Returns

`Promise<ContentList>` - The content list with items and pagination info

### Usage Example

```typescript
const listParams = {
  take: 10,
  skip: 0,
  sortField: 'title',
  sortDirection: 'asc'
};

const contentList = await client.contentMethods.getContentItems('articles', 'your-guid', 'en-us', listParams);
```

---

## getContentList

Retrieves content items with advanced filtering using POST request with filter object.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| referenceName | string | Yes | The reference name of the content model |
| guid | string | Yes | The website GUID |
| locale | string | Yes | The locale code |
| listParams | ListParams | Yes | Pagination and filtering parameters |
| filterObject | ContentListFilterModel | No | Advanced filter criteria |

### Returns

`Promise<ContentList>` - The content list with items and pagination info

### Usage Example

```typescript
const listParams = {
  take: 20,
  skip: 0,
  sortField: 'dateCreated',
  sortDirection: 'desc',
  showDeleted: false
};

const filterObject = {
  publishedState: 'published',
  searchText: 'important'
};

const contentList = await client.contentMethods.getContentList('articles', 'your-guid', 'en-us', listParams, filterObject);
```

---

## setContentListItemOrder

Puts the items of a content list in a given order, for one locale.

Pass the content IDs in the order they should appear. Items you leave out keep their current relative order after the ones you list, so sending part of a list never drops anything. The new order applies to the staging and the live list at once: no item gets a new version or changes state, so nothing needs publishing, including items that have unpublished changes. Order is kept per locale, so call this once for each locale whose order should change.

This makes one request and doesn't create a batch.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| referenceName | string | Yes | The reference name of the content list |
| guid | string | Yes | The website GUID |
| locale | string | Yes | The locale code |
| contentIDs | number[] | Yes | Content IDs in the order they should appear |
| skipUnknownIds | boolean | No | Leave out IDs that aren't in the list and order the rest, instead of failing. Default `false` |

### Returns

`Promise<ListItemOrderResult>`:
- `contentIDs`: every item in the list, in its new order
- `itemsUpdated`: how many items had their order changed (0 when the list was already in that order, in which case nothing is written)
- `updatedContentIDs`: the items whose order changed, in their new order
- `skippedContentIDs`: IDs that weren't in the list and were left out (only with `skipUnknownIds`)

### Errors

Throws `Exception`, with nothing changed:
- `statusCode` 400: a content ID is given twice, `contentIDs` is empty, or a content ID isn't an item in the list for that locale and `skipUnknownIds` is `false`
- `statusCode` 404: there's no list with that reference name

### Usage Example

```typescript
// Move 12 to the top of the footer links; the rest keep their order after it.
const result = await client.contentMethods.setContentListItemOrder('footer_links', 'your-guid', 'en-us', [12]);
console.log(result.contentIDs);   // e.g. [12, 9, 15]
console.log(result.itemsUpdated); // 0 if 12 was already first
```

---

## getContentHistory

Retrieves the history of changes for a specific content item.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| locale | string | Yes | The locale code |
| guid | string | Yes | The website GUID |
| contentID | number | Yes | The ID of the content item |
| take | number | No | Number of history entries to retrieve (default: 50) |
| skip | number | No | Number of history entries to skip (default: 0) |

### Returns

`Promise<ContentItemHistory>` - The content item history with pagination

### Usage Example

```typescript
const history = await client.contentMethods.getContentHistory('en-us', 'your-guid', 123, 25, 0);
console.log(history.items.length);
```

---

## getContentComments

Retrieves comments for a specific content item.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| locale | string | Yes | The locale code |
| guid | string | Yes | The website GUID |
| contentID | number | Yes | The ID of the content item |
| take | number | No | Number of comments to retrieve (default: 50) |
| skip | number | No | Number of comments to skip (default: 0) |

### Returns

`Promise<ItemComments>` - The content item comments with pagination

### Usage Example

```typescript
const comments = await client.contentMethods.getContentComments('en-us', 'your-guid', 123, 10, 0);
console.log(comments.items.length);
```

---

## Error Handling

All methods throw `Exception` objects on failure:

```typescript
try {
  const contentItem = await client.contentMethods.getContentItem(123, 'your-guid', 'en-us');
} catch (error) {
  console.error('Failed to get content item:', error.message);
}
```

---

## Navigation
- [← Back to Main Documentation](../README.md)
- [Authentication & Setup](./auth.md)
- [AssetMethods](./asset-methods.md)
- [BatchMethods](./batch-methods.md)
- [ContainerMethods](./container-methods.md)
- [InstanceMethods](./instance-methods.md)
- [InstanceUserMethods](./instance-user-methods.md)
- [ModelMethods](./model-methods.md)
- [PageMethods](./page-methods.md)
- [ServerUserMethods](./server-user-methods.md)
- [WebhookMethods](./webhook-methods.md) 