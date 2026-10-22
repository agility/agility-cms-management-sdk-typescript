# ContentMethods API Documentation

The `ContentMethods` class provides comprehensive functionality for managing content items, including creation, publication, approval workflows, and retrieval operations.

## Bulk Operations Overview

When working with multiple content items, use the bulk methods for better performance:

| Single Item Method   | Bulk Method                              | Use Case                            |
| -------------------- | ---------------------------------------- | ----------------------------------- |
| `saveContentItems()` | **`saveContentItems(contentItems[])`**   | Creating/updating multiple items    |
| `publishContent()`   | **`batchWorkflowContent(contentIDs[])`** | Publishing multiple items at once   |
| `unPublishContent()` | **`batchWorkflowContent(contentIDs[])`** | Unpublishing multiple items at once |

**Important:**

- Bulk methods accept **arrays** - pass ALL your items/IDs in a single call
- Returns content IDs **in the same order** as the input array, allowing you to correlate results with your original items

## Function List

| Function                                          | Description                                           |
| ------------------------------------------------- | ----------------------------------------------------- |
| [getContentItem](#getcontentitem)                 | Retrieves a specific content item by ID               |
| [publishContent](#publishcontent)                 | Publishes a single content item                       |
| [unPublishContent](#unpublishcontent)             | Unpublishes a single content item                     |
| [batchWorkflowContent](#batchworkflowcontent)     | **Bulk workflow operation on multiple content items** |
| [contentRequestApproval](#contentrequestapproval) | Requests approval for a content item                  |
| [approveContent](#approvecontent)                 | Approves a content item                               |
| [declineContent](#declinecontent)                 | Declines a content item                               |
| [deleteContent](#deletecontent)                   | Deletes a content item                                |
| [saveContentItem](#savecontentitem)               | Saves a single content item                           |
| [saveContentItems](#savecontentitems)             | **Saves multiple content items (bulk)**               |
| [getContentItems](#getcontentitems)               | Retrieves content items with filtering (deprecated)   |
| [getContentList](#getcontentlist)                 | Retrieves content list with advanced filtering        |
| [getContentHistory](#getcontenthistory)           | Retrieves content item history                        |
| [getContentComments](#getcontentcomments)         | Retrieves content item comments                       |

---

## getContentItem

Retrieves a specific content item by ID and locale.

### Parameters

| Parameter | Type   | Required | Description                            |
| --------- | ------ | -------- | -------------------------------------- |
| contentID | number | Yes      | The ID of the content item to retrieve |
| guid      | string | Yes      | The website GUID                       |
| locale    | string | Yes      | The locale code (e.g., 'en-us')        |

### Returns

`Promise<ContentItem>` - The content item object

### Usage Example

```typescript
const contentItem = await client.contentMethods.getContentItem(123, "your-guid", "en-us")
console.log(contentItem.fields.title)
```

---

## publishContent

Publishes a single content item through the batch workflow system.

**Note:** For publishing multiple items, use [`batchWorkflowContent()`](#batchworkflowcontent) with `WorkflowOperationType.Publish` instead.

### Parameters

| Parameter     | Type    | Required | Description                                           |
| ------------- | ------- | -------- | ----------------------------------------------------- |
| contentID     | number  | Yes      | The ID of the content item to publish                 |
| guid          | string  | Yes      | The website GUID                                      |
| locale        | string  | Yes      | The locale code                                       |
| comments      | string  | No       | Optional comments for the publish operation           |
| returnBatchId | boolean | No       | If true, returns batch ID immediately without waiting |

### Returns

`Promise<number[]>` - Array containing the content ID that was published

### Usage Example

```typescript
// Publish a single item
const publishedIds = await client.contentMethods.publishContent(123, "your-guid", "en-us", "Publishing update")
console.log("Published ID:", publishedIds[0])

// Return batch ID immediately for custom polling
const batchId = await client.contentMethods.publishContent(123, "your-guid", "en-us", null, true)
```

---

## unPublishContent

Unpublishes a single content item through the batch workflow system.

**Note:** For unpublishing multiple items, use [`batchWorkflowContent()`](#batchworkflowcontent) with `WorkflowOperationType.Unpublish` instead.

### Parameters

| Parameter     | Type    | Required | Description                                           |
| ------------- | ------- | -------- | ----------------------------------------------------- |
| contentID     | number  | Yes      | The ID of the content item to unpublish               |
| guid          | string  | Yes      | The website GUID                                      |
| locale        | string  | Yes      | The locale code                                       |
| comments      | string  | No       | Optional comments for the unpublish operation         |
| returnBatchId | boolean | No       | If true, returns batch ID immediately without waiting |

### Returns

`Promise<number[]>` - Array containing the content ID that was unpublished

### Usage Example

```typescript
const unpublishedIds = await client.contentMethods.unPublishContent(123, "your-guid", "en-us", "Temporary unpublish")
console.log("Unpublished ID:", unpublishedIds[0])
```

---

## batchWorkflowContent

**Recommended for bulk workflow operations.** Performs a batch workflow operation on **multiple content items at once**. Supports Publish, Unpublish, Approve, Decline, and RequestApproval operations.

**Pass ALL your content IDs in a single call** instead of calling `publishContent()` or `unPublishContent()` in a loop.

### Parameters

| Parameter     | Type                  | Required | Description                                                                 |
| ------------- | --------------------- | -------- | --------------------------------------------------------------------------- |
| contentIDs    | number[]              | Yes      | **Array of ALL content IDs to process** (e.g., `[101, 102, 103, 104, ...]`) |
| guid          | string                | Yes      | The website GUID                                                            |
| locale        | string                | Yes      | The locale code                                                             |
| operation     | WorkflowOperationType | Yes      | The workflow operation (see below)                                          |
| returnBatchId | boolean               | No       | If true, returns batch ID immediately without waiting                       |

### WorkflowOperationType Values

| Value                                   | Description                        |
| --------------------------------------- | ---------------------------------- |
| `WorkflowOperationType.Publish`         | Publish content items              |
| `WorkflowOperationType.Unpublish`       | Unpublish content items            |
| `WorkflowOperationType.Approve`         | Approve content items              |
| `WorkflowOperationType.Decline`         | Decline content items              |
| `WorkflowOperationType.RequestApproval` | Request approval for content items |

### Returns

`Promise<number[]>` - Array of content IDs that were processed, **in the same order as the input array**

### Important Notes

- **Pass Multiple IDs:** This method accepts an array of content IDs - pass ALL your IDs in one call (e.g., `[101, 102, 103, 104, 105]`), not one at a time.
- **Order Preservation:** The returned content IDs array maintains the same order as your input `contentIDs` array.
- **Performance:** Always use this method for bulk operations instead of calling single-item methods in a loop.
- **Atomic Operation:** All items are processed as a single batch operation.

### Usage Examples

#### Publish Multiple Items at Once

```typescript
import {WorkflowOperationType} from "@agility/management-sdk"

// Pass ALL content IDs you want to publish in a single array
const contentIDsToPublish = [101, 102, 103, 104, 105, 106, 107, 108, 109, 110]

const publishedIds = await client.contentMethods.batchWorkflowContent(
	contentIDsToPublish, // All IDs in one call
	"your-guid",
	"en-us",
	WorkflowOperationType.Publish,
)

// Returns all IDs in the same order: [101, 102, 103, 104, 105, 106, 107, 108, 109, 110]
console.log("Published:", publishedIds)
```

#### Bulk Publish After Save

```typescript
import {WorkflowOperationType} from "@agility/management-sdk"

// First, bulk save content items
const contentItems: ContentItem[] = [
	{
		contentID: -1,
		properties: {definitionName: "Article", referenceName: "articles"},
		fields: {title: "Article 1"},
	},
	{
		contentID: -1,
		properties: {definitionName: "Article", referenceName: "articles"},
		fields: {title: "Article 2"},
	},
	{
		contentID: -1,
		properties: {definitionName: "Article", referenceName: "articles"},
		fields: {title: "Article 3"},
	},
]

// Save all items - returns IDs in same order
const savedIds = await client.contentMethods.saveContentItems(contentItems, "your-guid", "en-us")
console.log("Saved IDs:", savedIds) // e.g., [101, 102, 103]

// Publish all saved items - returns IDs in same order
const publishedIds = await client.contentMethods.batchWorkflowContent(
	savedIds,
	"your-guid",
	"en-us",
	WorkflowOperationType.Publish,
)
console.log("Published IDs:", publishedIds) // [101, 102, 103] - same order

// Correlate results
savedIds.forEach((id, index) => {
	console.log(`Item "${contentItems[index].fields.title}" saved as ID ${id} and published`)
})
```

#### Bulk Unpublish

```typescript
const contentIDs = [101, 102, 103]

const unpublishedIds = await client.contentMethods.batchWorkflowContent(
	contentIDs,
	"your-guid",
	"en-us",
	WorkflowOperationType.Unpublish,
)

// unpublishedIds[0] = 101
// unpublishedIds[1] = 102
// unpublishedIds[2] = 103
```

#### Workflow Approval Process

```typescript
const contentIDs = [201, 202, 203]

// Step 1: Request approval for all items
const requestedIds = await client.contentMethods.batchWorkflowContent(
	contentIDs,
	"your-guid",
	"en-us",
	WorkflowOperationType.RequestApproval,
)
console.log("Approval requested for:", requestedIds)

// Step 2: Approve all items (typically done by an approver)
const approvedIds = await client.contentMethods.batchWorkflowContent(
	contentIDs,
	"your-guid",
	"en-us",
	WorkflowOperationType.Approve,
)
console.log("Approved:", approvedIds)

// Step 3: Publish approved items
const publishedIds = await client.contentMethods.batchWorkflowContent(
	approvedIds,
	"your-guid",
	"en-us",
	WorkflowOperationType.Publish,
)
console.log("Published:", publishedIds)
```

#### Decline Multiple Items

```typescript
const contentIDs = [301, 302]

const declinedIds = await client.contentMethods.batchWorkflowContent(
	contentIDs,
	"your-guid",
	"en-us",
	WorkflowOperationType.Decline,
)
console.log("Declined content IDs:", declinedIds)
```

---

## contentRequestApproval

Requests approval for a content item through the workflow system.

### Parameters

| Parameter     | Type    | Required | Description                                           |
| ------------- | ------- | -------- | ----------------------------------------------------- |
| contentID     | number  | Yes      | The ID of the content item                            |
| guid          | string  | Yes      | The website GUID                                      |
| locale        | string  | Yes      | The locale code                                       |
| comments      | string  | No       | Optional comments for the approval request            |
| returnBatchId | boolean | No       | If true, returns batch ID immediately without waiting |

### Returns

`Promise<number[]>` - Array of content IDs that had approval requested

### Usage Example

```typescript
const requestedIds = await client.contentMethods.contentRequestApproval(123, "your-guid", "en-us", "Ready for review")
```

---

## approveContent

Approves a content item in the workflow system.

### Parameters

| Parameter     | Type    | Required | Description                                           |
| ------------- | ------- | -------- | ----------------------------------------------------- |
| contentID     | number  | Yes      | The ID of the content item to approve                 |
| guid          | string  | Yes      | The website GUID                                      |
| locale        | string  | Yes      | The locale code                                       |
| comments      | string  | No       | Optional comments for the approval                    |
| returnBatchId | boolean | No       | If true, returns batch ID immediately without waiting |

### Returns

`Promise<number[]>` - Array of content IDs that were approved

### Usage Example

```typescript
const approvedIds = await client.contentMethods.approveContent(123, "your-guid", "en-us", "Approved for publication")
```

---

## declineContent

Declines a content item in the workflow system.

### Parameters

| Parameter     | Type    | Required | Description                                           |
| ------------- | ------- | -------- | ----------------------------------------------------- |
| contentID     | number  | Yes      | The ID of the content item to decline                 |
| guid          | string  | Yes      | The website GUID                                      |
| locale        | string  | Yes      | The locale code                                       |
| comments      | string  | No       | Optional comments for the decline                     |
| returnBatchId | boolean | No       | If true, returns batch ID immediately without waiting |

### Returns

`Promise<number[]>` - Array of content IDs that were declined

### Usage Example

```typescript
const declinedIds = await client.contentMethods.declineContent(123, "your-guid", "en-us", "Needs revision")
```

---

## deleteContent

Deletes a content item through the batch workflow system.

### Parameters

| Parameter     | Type    | Required | Description                                           |
| ------------- | ------- | -------- | ----------------------------------------------------- |
| contentID     | number  | Yes      | The ID of the content item to delete                  |
| guid          | string  | Yes      | The website GUID                                      |
| locale        | string  | Yes      | The locale code                                       |
| comments      | string  | No       | Optional comments for the deletion                    |
| returnBatchId | boolean | No       | If true, returns batch ID immediately without waiting |

### Returns

`Promise<number[]>` - Array of content IDs that were deleted

### Usage Example

```typescript
const deletedIds = await client.contentMethods.deleteContent(123, "your-guid", "en-us", "Removing outdated content")
```

---

## saveContentItem

Saves a single content item (create or update) through the batch workflow system.

**Note:** For bulk operations, use [`saveContentItems()`](#savecontentitems) instead for better performance.

### Parameters

| Parameter     | Type        | Required | Description                                           |
| ------------- | ----------- | -------- | ----------------------------------------------------- |
| contentItem   | ContentItem | Yes      | The content item object to save                       |
| guid          | string      | Yes      | The website GUID                                      |
| locale        | string      | Yes      | The locale code                                       |
| returnBatchId | boolean     | No       | If true, returns batch ID immediately without waiting |

### Returns

`Promise<number[]>` - Array containing the content ID that was saved

### ContentItem Structure

```typescript
interface ContentItem {
	contentID: number // Use -1 or 0 for new items, existing ID for updates
	properties: {
		definitionName: string // The content model name
		referenceName: string // The container reference name
		itemOrder?: number // Optional ordering
		releaseDate?: string // Optional scheduled release date
		pullDate?: string // Optional scheduled pull date
	}
	fields: {
		[key: string]: any // Field values matching the content model
	}
	seo?: {
		// Optional SEO properties
		metaDescription?: string
		metaKeywords?: string
		metaHTML?: string
		menuVisible?: boolean
		sitemapVisible?: boolean
	}
	scripts?: {
		// Optional custom scripts
		top?: string
		bottom?: string
	}
}
```

### Usage Example

```typescript
// Create a new content item
const newItem: ContentItem = {
	contentID: -1, // -1 or 0 for new items
	properties: {
		definitionName: "BlogPost",
		referenceName: "blogposts",
	},
	fields: {
		title: "New Article",
		content: "Article content...",
		author: "John Doe",
		publishDate: "2024-01-15",
	},
	seo: {
		metaDescription: "A great new article",
	},
}

const savedIds = await client.contentMethods.saveContentItem(newItem, "your-guid", "en-us")
console.log("Created content ID:", savedIds[0])

// Update an existing content item
const existingItem = await client.contentMethods.getContentItem(123, "your-guid", "en-us")
existingItem.fields.title = "Updated Title"
const updatedIds = await client.contentMethods.saveContentItem(existingItem, "your-guid", "en-us")
```

---

## saveContentItems

**Recommended for bulk operations.** Saves multiple content items in a single batch operation.

### Parameters

| Parameter     | Type          | Required | Description                                           |
| ------------- | ------------- | -------- | ----------------------------------------------------- |
| contentItems  | ContentItem[] | Yes      | Array of content item objects to save                 |
| guid          | string        | Yes      | The website GUID                                      |
| locale        | string        | Yes      | The locale code                                       |
| returnBatchId | boolean       | No       | If true, returns batch ID immediately without waiting |

### Returns

`Promise<number[]>` - Array of content IDs that were saved, **in the same order as the input array**

### Important Notes

- **Order Preservation:** The returned content IDs array maintains the same order as your input `contentItems` array. This allows you to correlate each returned ID with its corresponding input item.
- **Performance:** For bulk operations (2+ items), always use `saveContentItems()` instead of calling `saveContentItem()` in a loop.
- **Mixed Operations:** You can mix new items (`contentID: -1`) and updates (existing `contentID`) in the same batch.

Note: If you receive a -1 as part of the return array, that means there was a problem in saving your item. We are working improving our messaging to get you the exact error message in those cases, but until then, the recommendation is to log that save failure and check into manually.

### Usage Examples

#### Basic Bulk Save

```typescript
const contentItems: ContentItem[] = [
	{
		contentID: -1,
		properties: {definitionName: "BlogPost", referenceName: "blogposts"},
		fields: {title: "Article 1", slug: "article-1"},
	},
	{
		contentID: -1,
		properties: {definitionName: "BlogPost", referenceName: "blogposts"},
		fields: {title: "Article 2", slug: "article-2"},
	},
	{
		contentID: -1,
		properties: {definitionName: "BlogPost", referenceName: "blogposts"},
		fields: {title: "Article 3", slug: "article-3"},
	},
]

const savedIds = await client.contentMethods.saveContentItems(contentItems, "your-guid", "en-us")

// savedIds[0] corresponds to 'Article 1'
// savedIds[1] corresponds to 'Article 2'
// savedIds[2] corresponds to 'Article 3'
console.log("Created IDs:", savedIds)
```

#### Correlating Results with Input Data

```typescript
// Example: Import products and track their new IDs
const products = [
	{sku: "SKU-001", name: "Product A", price: 29.99},
	{sku: "SKU-002", name: "Product B", price: 49.99},
	{sku: "SKU-003", name: "Product C", price: 19.99},
]

const contentItems: ContentItem[] = products.map((product) => ({
	contentID: -1,
	properties: {definitionName: "Product", referenceName: "products"},
	fields: {
		sku: product.sku,
		name: product.name,
		price: product.price,
	},
}))

const savedIds = await client.contentMethods.saveContentItems(contentItems, "your-guid", "en-us")

// Map the returned IDs back to original products (same order!)
const productsWithIds = products.map((product, index) => ({
	...product,
	contentID: savedIds[index],
}))

console.log(productsWithIds)
// [
//   { sku: 'SKU-001', name: 'Product A', price: 29.99, contentID: 101 },
//   { sku: 'SKU-002', name: 'Product B', price: 49.99, contentID: 102 },
//   { sku: 'SKU-003', name: 'Product C', price: 19.99, contentID: 103 }
// ]
```

#### Bulk Save and Publish

```typescript
// Step 1: Save multiple items
const contentItems: ContentItem[] = [
	{
		contentID: -1,
		properties: {definitionName: "NewsArticle", referenceName: "news"},
		fields: {title: "Breaking News 1", content: "..."},
	},
	{
		contentID: -1,
		properties: {definitionName: "NewsArticle", referenceName: "news"},
		fields: {title: "Breaking News 2", content: "..."},
	},
]

const savedIds = await client.contentMethods.saveContentItems(contentItems, "your-guid", "en-us")
console.log("Saved content IDs:", savedIds) // e.g., [201, 202]

// Step 2: Publish all saved items using batchWorkflowContent
import {WorkflowOperationType} from "@agility/management-sdk"

const publishedIds = await client.contentMethods.batchWorkflowContent(
	savedIds,
	"your-guid",
	"en-us",
	WorkflowOperationType.Publish,
)
console.log("Published content IDs:", publishedIds) // [201, 202] - same order
```

#### Mixed Create and Update Operations

```typescript
const contentItems: ContentItem[] = [
	// New item
	{
		contentID: -1,
		properties: {definitionName: "BlogPost", referenceName: "blogposts"},
		fields: {title: "Brand New Post"},
	},
	// Update existing item
	{
		contentID: 456, // Existing content ID
		properties: {definitionName: "BlogPost", referenceName: "blogposts"},
		fields: {title: "Updated Existing Post"},
	},
]

const savedIds = await client.contentMethods.saveContentItems(contentItems, "your-guid", "en-us")
// savedIds[0] = new ID for 'Brand New Post'
// savedIds[1] = 456 (the updated item retains its ID)
```

---

## getContentItems

Retrieves content items with basic filtering parameters (deprecated - use getContentList instead).

### Parameters

| Parameter     | Type       | Required | Description                             |
| ------------- | ---------- | -------- | --------------------------------------- |
| referenceName | string     | Yes      | The reference name of the content model |
| guid          | string     | Yes      | The website GUID                        |
| locale        | string     | Yes      | The locale code                         |
| listParams    | ListParams | Yes      | Pagination and filtering parameters     |

### Returns

`Promise<ContentList>` - The content list with items and pagination info

### Usage Example

```typescript
const listParams = {
	take: 10,
	skip: 0,
	sortField: "title",
	sortDirection: "asc",
}

const contentList = await client.contentMethods.getContentItems("articles", "your-guid", "en-us", listParams)
```

---

## getContentList

Retrieves content items with advanced filtering using POST request with filter object.

### Parameters

| Parameter     | Type                   | Required | Description                             |
| ------------- | ---------------------- | -------- | --------------------------------------- |
| referenceName | string                 | Yes      | The reference name of the content model |
| guid          | string                 | Yes      | The website GUID                        |
| locale        | string                 | Yes      | The locale code                         |
| listParams    | ListParams             | Yes      | Pagination and filtering parameters     |
| filterObject  | ContentListFilterModel | No       | Advanced filter criteria                |

### Returns

`Promise<ContentList>` - The content list with items and pagination info

### Usage Example

```typescript
const listParams = {
	take: 20,
	skip: 0,
	sortField: "dateCreated",
	sortDirection: "desc",
	showDeleted: false,
}

const filterObject = {
	publishedState: "published",
	searchText: "important",
}

const contentList = await client.contentMethods.getContentList(
	"articles",
	"your-guid",
	"en-us",
	listParams,
	filterObject,
)
```

---

## getContentHistory

Retrieves the history of changes for a specific content item.

### Parameters

| Parameter | Type   | Required | Description                                         |
| --------- | ------ | -------- | --------------------------------------------------- |
| locale    | string | Yes      | The locale code                                     |
| guid      | string | Yes      | The website GUID                                    |
| contentID | number | Yes      | The ID of the content item                          |
| take      | number | No       | Number of history entries to retrieve (default: 50) |
| skip      | number | No       | Number of history entries to skip (default: 0)      |

### Returns

`Promise<ContentItemHistory>` - The content item history with pagination

### Usage Example

```typescript
const history = await client.contentMethods.getContentHistory("en-us", "your-guid", 123, 25, 0)
console.log(history.items.length)
```

---

## getContentComments

Retrieves comments for a specific content item.

### Parameters

| Parameter | Type   | Required | Description                                  |
| --------- | ------ | -------- | -------------------------------------------- |
| locale    | string | Yes      | The locale code                              |
| guid      | string | Yes      | The website GUID                             |
| contentID | number | Yes      | The ID of the content item                   |
| take      | number | No       | Number of comments to retrieve (default: 50) |
| skip      | number | No       | Number of comments to skip (default: 0)      |

### Returns

`Promise<ItemComments>` - The content item comments with pagination

### Usage Example

```typescript
const comments = await client.contentMethods.getContentComments("en-us", "your-guid", 123, 10, 0)
console.log(comments.items.length)
```

---

## Best Practices for Imports and Syncs

When importing content from external systems or syncing with third-party data sources, follow these guidelines for optimal performance and reliability.

### Recommended Approach

1. **Do all lookups first** - Check which items already exist before making any changes
2. **Batch your saves** - Use `saveContentItems()` to save multiple items in a single call
3. **Batch your publishes** - Use `batchWorkflowContent()` to publish all saved items at once
4. **Use single-threaded processing** - Process batches sequentially, not in parallel

### Why Avoid Parallelism?

**Do NOT use parallel API calls to speed up imports.** While it may seem faster, parallel requests can:

- Overwhelm the API and cause rate limiting
- Lead to race conditions and inconsistent state
- Result in batch conflicts and failed operations

Instead, batch your updates in chunks and process them sequentially in a single thread.

### Strategy for Large Imports

For large datasets or ongoing syncs with external systems:

```typescript
import {WorkflowOperationType} from "@agility/management-sdk"

async function syncExternalData(externalItems: ExternalItem[]) {
	const guid = "your-guid"
	const locale = "en-us"

	// Step 1: Pull existing content list and build a lookup map
	const existingContent = await client.contentMethods.getContentList(
		"products",
		guid,
		locale,
		{take: 1000, skip: 0}, // Adjust based on your data size
	)

	// Build a map for fast duplicate checking (key = external ID or SKU)
	const existingMap = new Map<string, number>()
	for (const item of existingContent.items) {
		if (item.fields.externalId) {
			existingMap.set(item.fields.externalId, item.contentID)
		}
	}

	// Step 2: Separate items into creates vs updates
	const itemsToCreate: ContentItem[] = []
	const itemsToUpdate: ContentItem[] = []

	for (const ext of externalItems) {
		const existingId = existingMap.get(ext.externalId)

		if (existingId) {
			// Update existing item
			itemsToUpdate.push({
				contentID: existingId,
				properties: {definitionName: "Product", referenceName: "products"},
				fields: {name: ext.name, price: ext.price, externalId: ext.externalId},
			})
		} else {
			// Create new item
			itemsToCreate.push({
				contentID: -1,
				properties: {definitionName: "Product", referenceName: "products"},
				fields: {name: ext.name, price: ext.price, externalId: ext.externalId},
			})
		}
	}

	// Step 3: Process in batches (recommended batch size: 50-100 items)
	const BATCH_SIZE = 50
	const allSavedIds: number[] = []

	// Process creates in batches
	for (let i = 0; i < itemsToCreate.length; i += BATCH_SIZE) {
		const batch = itemsToCreate.slice(i, i + BATCH_SIZE)
		const savedIds = await client.contentMethods.saveContentItems(batch, guid, locale)
		allSavedIds.push(...savedIds)
		console.log(`Created batch ${Math.floor(i / BATCH_SIZE) + 1}: ${savedIds.length} items`)
	}

	// Process updates in batches
	for (let i = 0; i < itemsToUpdate.length; i += BATCH_SIZE) {
		const batch = itemsToUpdate.slice(i, i + BATCH_SIZE)
		const savedIds = await client.contentMethods.saveContentItems(batch, guid, locale)
		allSavedIds.push(...savedIds)
		console.log(`Updated batch ${Math.floor(i / BATCH_SIZE) + 1}: ${savedIds.length} items`)
	}

	// Step 4: Publish all saved items in batches
	for (let i = 0; i < allSavedIds.length; i += BATCH_SIZE) {
		const batch = allSavedIds.slice(i, i + BATCH_SIZE)
		await client.contentMethods.batchWorkflowContent(batch, guid, locale, WorkflowOperationType.Publish)
		console.log(`Published batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} items`)
	}

	return {
		created: itemsToCreate.length,
		updated: itemsToUpdate.length,
		published: allSavedIds.length,
	}
}
```

### Strategy for Small Lists or Initial Imports

For smaller datasets or one-time initial imports, you can simplify by pulling the entire content list for local duplicate checking:

```typescript
async function initialImport(sourceData: SourceItem[]) {
	const guid = "your-guid"
	const locale = "en-us"

	// For initial imports or small lists: pull everything and check locally
	const existing = await client.contentMethods.getContentList("articles", guid, locale, {take: 5000, skip: 0})

	// Build hashtable/map for O(1) duplicate lookups
	const existingBySlug = new Map(existing.items.map((item) => [item.fields.slug, item.contentID]))

	// Filter to only new items
	const newItems = sourceData.filter((item) => !existingBySlug.has(item.slug))

	if (newItems.length === 0) {
		console.log("No new items to import")
		return
	}

	// Transform and save all new items
	const contentItems = newItems.map((item) => ({
		contentID: -1,
		properties: {definitionName: "Article", referenceName: "articles"},
		fields: {title: item.title, slug: item.slug, body: item.body},
	}))

	const savedIds = await client.contentMethods.saveContentItems(contentItems, guid, locale)

	// Publish all at once
	const publishedIds = await client.contentMethods.batchWorkflowContent(
		savedIds,
		guid,
		locale,
		WorkflowOperationType.Publish,
	)

	console.log(`Imported and published ${publishedIds.length} new items`)
}
```

### Summary

| Scenario                    | Strategy                                                                             |
| --------------------------- | ------------------------------------------------------------------------------------ |
| Large ongoing sync          | Pull existing → build map → batch saves → batch publishes                            |
| Small list / initial import | Pull all existing → local duplicate check → single batch save → single batch publish |
| Any import                  | **Always use sequential batching, never parallel requests**                          |

---

## Complete Bulk Workflow Example

This example demonstrates a complete workflow for bulk creating, saving, and publishing content items while tracking the correlation between input data and resulting content IDs.

```typescript
import agilityMgmt, {WorkflowOperationType} from "@agility/management-sdk"

async function bulkImportAndPublish() {
	const client = agilityMgmt.getApi({
		location: "USA",
		websiteId: "your-guid",
		securityKey: "your-api-key",
	})

	const guid = "your-guid"
	const locale = "en-us"

	// Source data to import
	const sourceData = [
		{externalId: "ext-001", title: "First Article", body: "Content 1..."},
		{externalId: "ext-002", title: "Second Article", body: "Content 2..."},
		{externalId: "ext-003", title: "Third Article", body: "Content 3..."},
		{externalId: "ext-004", title: "Fourth Article", body: "Content 4..."},
	]

	// Step 1: Transform source data into ContentItem objects
	const contentItems = sourceData.map((item) => ({
		contentID: -1, // New items
		properties: {
			definitionName: "Article",
			referenceName: "articles",
		},
		fields: {
			title: item.title,
			body: item.body,
			externalId: item.externalId, // Track original ID in a field
		},
	}))

	// Step 2: Bulk save all items using saveContentItems()
	console.log(`Saving ${contentItems.length} content items...`)
	const savedIds = await client.contentMethods.saveContentItems(contentItems, guid, locale)

	// savedIds are in the SAME ORDER as contentItems input
	console.log("Saved content IDs:", savedIds)

	// Step 3: Create a mapping of external IDs to Agility content IDs
	const idMapping = sourceData.map((item, index) => ({
		externalId: item.externalId,
		title: item.title,
		contentID: savedIds[index], // Same order guarantees correct mapping
	}))

	console.log("ID Mapping:")
	idMapping.forEach((m) => {
		console.log(`  ${m.externalId} -> contentID: ${m.contentID} ("${m.title}")`)
	})

	// Step 4: Bulk publish all saved items using batchWorkflowContent()
	console.log(`Publishing ${savedIds.length} content items...`)
	const publishedIds = await client.contentMethods.batchWorkflowContent(
		savedIds,
		guid,
		locale,
		WorkflowOperationType.Publish,
	)

	// publishedIds are in the SAME ORDER as savedIds input
	console.log("Published content IDs:", publishedIds)

	// Verify the order is maintained
	publishedIds.forEach((id, index) => {
		console.log(`Published: ${idMapping[index].title} (contentID: ${id})`)
	})

	return idMapping
}

// Run the import
bulkImportAndPublish()
	.then((mapping) => console.log("Import complete!", mapping))
	.catch((err) => console.error("Import failed:", err))
```

### Output Example

```
Saving 4 content items...
Saved content IDs: [1001, 1002, 1003, 1004]
ID Mapping:
  ext-001 -> contentID: 1001 ("First Article")
  ext-002 -> contentID: 1002 ("Second Article")
  ext-003 -> contentID: 1003 ("Third Article")
  ext-004 -> contentID: 1004 ("Fourth Article")
Publishing 4 content items...
Published content IDs: [1001, 1002, 1003, 1004]
Published: First Article (contentID: 1001)
Published: Second Article (contentID: 1002)
Published: Third Article (contentID: 1003)
Published: Fourth Article (contentID: 1004)
Import complete!
```

---

## Error Handling

All methods throw `Exception` objects on failure:

```typescript
try {
	const contentItem = await client.contentMethods.getContentItem(123, "your-guid", "en-us")
} catch (error) {
	console.error("Failed to get content item:", error.message)
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
