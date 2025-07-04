# Agility CMS & Management API TypeScript SDK

## About the Management API SDK

- Provides a facility to developers to use the new Agility Management API more effectively.
- Provides methods to perform operations on Assets, Batches, Containers, Content, Models, Pages, and Users.
- **Content and Page Creation** - Create individual or multiple content items and pages (which automatically get added to batches).
- **Essential batch workflow operations** - Perform publish, unpublish, approve, decline, and request approval operations on existing batches.
- Ability to generate Content in bulk for a Website.
- **Strongly typed TypeScript interfaces** for all batch operations with comprehensive error handling.

## Getting Started

### Prerequisites
1. Clone the repository agility-cms-management-sdk-typescript.
2. Import the index file to make use of the Options class.
3. You will need valid Agility CMS credentials to authenticate and obtain an access token.

### Authentication
Before using the SDK, you must authenticate against the Agility Management API to obtain a valid access token. This token is required for all subsequent API requests.

The authentication process uses OAuth 2.0 and requires multiple steps:

1. First, initiate the authorization flow by making a GET request to the authorization endpoint:
```javascript
const authUrl = 'https://mgmt.aglty.io/oauth/authorize';

//if you wish to implement offline access using refresh tokens, use this URL (enables refresh tokens)
//const authUrl = 'https://mgmt.aglty.io/oauth/authorize?scope=offline-access '; 

const params = new URLSearchParams({
  response_type: 'code',
  redirect_uri: 'YOUR_REDIRECT_URI',
  state: 'YOUR_STATE',
  scope: 'openid profile email offline_access'
});

// Redirect the user to the authorization URL
window.location.href = `${authUrl}?${params.toString()}`;
```

2. After successful authentication, you'll receive an authorization code at your redirect URI. Use this code to obtain an access token:
```javascript
const response = await fetch('https://mgmt.aglty.io/oauth/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: new URLSearchParams({
    code: 'YOUR_AUTHORIZATION_CODE'
  })
});

const { access_token, refresh_token, expires_in } = await response.json();
```

3. Use the obtained token to initialize the SDK:
```javascript
import * as mgmtApi from "@agility/management-sdk";

// Initialize the Options Class with your authentication token
let options = new mgmtApi.Options();
options.token = access_token; // Use the token obtained from authentication

// Initialize the APIClient Class
let apiClient = new mgmtApi.ApiClient(options);

let guid = "<<Provide the Guid of the Website>>";
let locale = "<<Provide the locale of the Website>>"; // Example: en-us

// Now you can make authenticated requests
var contentItem = await apiClient.contentMethods.getContentItem(22, guid, locale);
console.log(JSON.stringify(contentItem));
```

4. When the access token expires, use the refresh token to obtain a new access token:
```javascript
const response = await fetch('https://mgmt.aglty.io/oauth/refresh', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    refresh_token: 'YOUR_REFRESH_TOKEN'
  })
});

const { access_token, refresh_token, expires_in } = await response.json();
```

Note: 
- The access token has a limited lifetime (typically 1 hour)
- The refresh token can be used to obtain new access tokens
- Store refresh tokens securely and never expose them in client-side code
- Implement proper error handling for authentication failures


### Making a Request
```Javascript
import * as mgmtApi from "@agility/management-sdk";

//initialize the Options Class
let options = new mgmtApi.Options();

options.token = "<<Provide Auth Token>>"
//Initialize the APIClient Class
let apiClient = new mgmtApi.ApiClient(options);

let guid = "<<Provide the Guid of the Website>>";
let locale = "<<Provide the locale of the Website>>"; //Example: en-us



//make the request: get a content item with the ID '22'
var contentItem = await apiClient.contentMethods.getContentItem(22,guid, locale);

//To log the response of the contentItem object in console.
console.log(JSON.stringify(contentItem));
```

## Understanding Agility CMS Batch Architecture

Agility CMS uses a simple approach for working with content and batches:

### Content/Page Creation (Handled by Respective Controllers)
- **contentMethods.saveContentItem()** - Creates a single new content item and adds it to a batch
- **contentMethods.saveContentItems()** - Creates multiple new content items and adds them to a batch  
- **pageMethods.savePage()** - Creates a new page and adds it to a batch
- These methods create the content AND automatically handle batch creation/management

### Batch Workflow Operations (Handled by Batch Controller)
- **batchMethods.publishBatch()** - Publishes all items in an existing batch
- **batchMethods.unpublishBatch()** - Unpublishes all items in an existing batch
- **batchMethods.approveBatch()** - Approves all items in an existing batch
- **batchMethods.declineBatch()** - Declines all items in an existing batch
- **batchMethods.requestApprovalBatch()** - Requests approval for all items in an existing batch
- **batchMethods.getBatch()** - Retrieves details of an existing batch
- **batchMethods.getBatchTypes()** - Retrieves all batch-related enum types for developer discovery

## Class AssetMethods
This class is used to perform operations related to Assets. The following are the methods: -

### upload
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `formData` | `FormData` | This is an object of type FormData where files can be posted eg : `const file = fs.readFileSync(<<Local File>>, null);const form = new FormData(); form.append('files',file,'<<File Name>>');`|
| `agilityFolderPath` | `string` | Path of the folder in Agility where the file(s) needs to be uploaded.|
| `guid` | `string` | Current website guid.|
| `groupingID` | `number` | Path of the folder in Agility where the file(s) needs to be uploaded.|

Returns: A collection of ```Media``` class Object.

### createFolder
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `originKey` | `string` | The origin key of the requested folder.  |
| `guid` | `string` | Current website guid.|

Returns: A collection of ```Media``` class Object.

### deleteFolder
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `originKey` | `string` | The origin key of the requested folder.  |
| `guid` | `string` | Current website guid.|
| `mediaID` | `number` | The mediaID of the folder that needs to be deleted.|

### renameFolder
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `folderName` | `string` | The original folder name.  |
| `newFolderName` | `string` | The new folder name.  |
| `guid` | `string` | Current website guid.|
| `mediaID` | `number` | The mediaID of the folder that needs to be renamed.|

### deleteFile
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `mediaID` | `number` | The mediaID of the asset which needs to be deleted.|
| `guid` | `string` | Current website guid.|
Returns
A ```string``` response if a file has been deleted.

### moveFile
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `mediaID` | `number` | The mediaID of the file that needs to be moved.|
| `newFolder` | `string` | The new location (in Agility) where the file needs to be moved.|
| `guid` | `string` | Current website guid.|

Returns: An object of ```Media``` class with the new location of the file.

### getMediaList
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `pageSize` | `number` | The page size on which the assets needs to selected.|
| `recordOffset` | `number` | The record offset value to skip search results.|
| `guid` | `string` | Current website guid.|

Returns: An object of ```AssetMediaList``` class.

### getGalleryById
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `guid` | `string` | Current website guid.|
| `id` | `number` | The ID of the requested gallery.|

Returns: An object of ```assetMediaGrouping``` class.

### getGalleryByName
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `guid` | `string` | Current website guid.|
| `galleryName` | `string` | The name of the requested gallery.|

Returns: An object of ```assetMediaGrouping``` class.

### getDefaultContainer
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `guid` | `string` | Current website guid.|

Returns: An object of ```assetContainer``` class.

### getGalleries
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `guid` | `string` | Current website guid.|
| `search` | `string` | String to search a specific gallery item.|
| `pageSize` | `number` | The pageSize on which the galleries needs to be selected.|
| `rowIndex` | `number` | The rowIndex value for the resultant record set.|

Returns: An object of ```assetGalleries``` class.

### saveGallery
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `guid` | `string` | Current website guid.|
| `gallery` | `assetMediaGrouping` | Object of AssetMediaGrouping class.|

Returns: An object of ```assetMediaGrouping``` class.

### deleteGallery
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `guid` | `string` | Current website guid.|
| `id` | `number` | The id of the gallery to be deleted.|

A ```string``` response if the gallery has been deleted.

### getAssetByID
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `mediaID` | `number` | The mediaID of the requested asset.|
| `guid` | `string` | Current website guid.|

Returns: An object of ```Media``` class with the information of the asset.

### getAssetByUrl
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `url` | `string` | The url of the requested asset.|
| `guid` | `string` | Current website guid.|

Returns: An object of ```Media``` class with the information of the asset.

## Class BatchMethods
This class is used to perform **workflow operations** on existing batches. 

**Important**: To CREATE new content or pages, use `contentMethods.saveContentItem(s)` or `pageMethods.savePage()` instead. These batch methods are for managing workflow operations (publish, unpublish, approve, etc.) on existing batches.

### getBatch
Retrieves details of an existing batch.

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `batchID` | `number` | The batchID of the requested batch.|
| `guid` | `string` | Current website guid.|
| `expandItems` | `boolean` | *(Optional)* Whether to include full item details. Default: `true`|

Returns: An object of ```Batch``` class.

```javascript
// Get batch with full item details (default)
const batch = await apiClient.batchMethods.getBatch(123, guid);

// Get basic batch information only (performance optimization)
const batchBasic = await apiClient.batchMethods.getBatch(123, guid, false);
```

### publishBatch
Publishes all items in an existing batch.

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `batchID` | `number` | The batchID of the batch to publish.|
| `guid` | `string` | Current website guid.|
| `returnBatchId` | `boolean` | *(Optional)* If `true`, returns batch ID immediately. If `false` (default), waits for completion.|

Returns: A ```number``` representing the batch ID.

```javascript
// Publish batch and wait for completion (default)
const batchId = await apiClient.batchMethods.publishBatch(123, guid);

// Publish batch and return immediately for custom polling
const batchId = await apiClient.batchMethods.publishBatch(123, guid, true);
```

### unpublishBatch
Unpublishes all items in an existing batch.

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `batchID` | `number` | The batchID of the batch to unpublish.|
| `guid` | `string` | Current website guid.|
| `returnBatchId` | `boolean` | *(Optional)* If `true`, returns batch ID immediately. If `false` (default), waits for completion.|

Returns: A ```number``` representing the batch ID.

### approveBatch
Approves all items in an existing batch.

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `batchID` | `number` | The batchID of the batch to approve.|
| `guid` | `string` | Current website guid.|
| `returnBatchId` | `boolean` | *(Optional)* If `true`, returns batch ID immediately. If `false` (default), waits for completion.|

Returns: A ```number``` representing the batch ID.

### declineBatch
Declines all items in an existing batch.

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `batchID` | `number` | The batchID of the batch to decline.|
| `guid` | `string` | Current website guid.|
| `returnBatchId` | `boolean` | *(Optional)* If `true`, returns batch ID immediately. If `false` (default), waits for completion.|

Returns: A ```number``` representing the batch ID.

### requestApprovalBatch
Requests approval for all items in an existing batch.

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `batchID` | `number` | The batchID of the batch to request approval for.|
| `guid` | `string` | Current website guid.|
| `returnBatchId` | `boolean` | *(Optional)* If `true`, returns batch ID immediately. If `false` (default), waits for completion.|

Returns: A ```number``` representing the batch ID.

### getBatchTypes
Retrieves all batch-related enum types for developer discovery and dynamic UI population.

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `guid` | `string` | Current website guid.|

Returns: A ```BatchTypesResponse``` object containing all enum types.

```javascript
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

## Complete Workflow Example

Here's a complete example showing how to work with batches:

```typescript
import { ApiClient } from '@agility/management-sdk';

const client = new ApiClient({ token: 'your-token' });
const guid = 'your-instance-guid';
const locale = 'en-us';

// Get batch types for dynamic UI and validation
const batchTypes = await client.batchMethods.getBatchTypes(guid);
console.log('Available batch types loaded:', batchTypes);

// Create NEW content items (handled by content controller)
// This automatically creates and manages batches
const newContentBatchID = await client.contentMethods.saveContentItem(locale, {
    properties: {
        referenceName: 'blog-post',
        definitionName: 'BlogPost',
        state: 2
    },
    fields: {
        title: 'My New Blog Post',
        content: 'This is the blog post content...'
    }
});

// Create NEW page (handled by page controller)  
// This automatically creates and manages batches
const newPageBatchID = await client.pageMethods.savePage(locale, {
    name: 'new-product-page',
    title: 'New Product Page',
    menuText: 'New Product',
    pageType: 'static',
    templateName: 'Product Template',
    parentPageID: -1
});

// Retrieve details of an existing batch
const batchDetails = await client.batchMethods.getBatch(newContentBatchID, guid);
console.log('Batch details:', batchDetails);

// Perform workflow operations on existing batches
await client.batchMethods.publishBatch(newContentBatchID, guid);
await client.batchMethods.approveBatch(newPageBatchID, guid);

// Or use immediate return for custom polling
const batchId = await client.batchMethods.publishBatch(newContentBatchID, guid, true);
console.log('Batch submitted for publishing:', batchId);

console.log('All operations completed successfully!');
```

## Summary: Complete BatchMethods API

The `BatchMethods` class provides **7 essential methods** for batch workflow management:

### **Batch Operations (7 methods)**
- `getBatch()` - Retrieve batch details and status
- `publishBatch()` - Publish all items in a batch
- `unpublishBatch()` - Unpublish all items in a batch
- `approveBatch()` - Approve all items in a batch
- `declineBatch()` - Decline all items in a batch
- `requestApprovalBatch()` - Request approval for all items in a batch
- `getBatchTypes()` - Get all enum types for dynamic UIs

**Developer Experience Features:**
- 🎨 **Dynamic UI Support** - `getBatchTypes()` populates dropdowns automatically
- ✅ **Strong Typing** - Full TypeScript support with intellisense
- 🔄 **Auto-Retry Logic** - Built-in polling for operation completion
- 📚 **Self-Documenting** - Enum discovery eliminates hard-coded values
- ⚡ **Streamlined API** - Focused on essential batch workflow operations

## TypeScript Interfaces

### Batch Response Interfaces

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

## Available Enums

### WorkflowOperationType (for batch processing)
> **Note**: In the API documentation (Swagger UI), these operations appear as descriptive dropdown options (Publish, Unpublish, Approve, Decline, RequestApproval) instead of numbers.

- `Publish = 1`
- `Unpublish = 2` 
- `Approve = 3`
- `Decline = 4`
- `RequestApproval = 5`

### BatchItemType
> **Note**: In the API documentation (Swagger UI), these appear as descriptive dropdown options (Page, ContentItem, ContentList, Tag, ModuleDef) instead of numbers.

- `Page = 1`
- `ContentItem = 2`
- `ContentList = 3`
- `Tag = 4`
- `ModuleDef = 5`

### BatchState
> **Note**: In the API documentation (Swagger UI), these appear as descriptive names (None, Pending, InProcess, Processed, Deleted) instead of numbers.

- `None = 0` - Batch created but not submitted for processing
- `Pending = 1` - Batch is pending processing
- `InProcess = 2` - Batch is currently being processed  
- `Processed = 3` - Batch has been processed successfully
- `Deleted = 4` - Batch has been deleted

## Error Handling

All methods throw exceptions on failure:

```typescript
try {
    const batch = await client.batchMethods.getBatch(123, 'instance-guid');
} catch (error) {
    console.error('Failed to get batch:', error.message);
}
```

## License

MIT

If you have feedback or questions about this starter, please use the [Github Issues](https://github.com/agility/agility-cms-management-sdk-typescript/issues) on this repo, join our [Community Slack Channel](https://join.slack.com/t/agilitycommunity/shared_invite/enQtNzI2NDc3MzU4Njc2LWI2OTNjZTI3ZGY1NWRiNTYzNmEyNmI0MGZlZTRkYzI3NmRjNzkxYmI5YTZjNTg2ZTk4NGUzNjg5NzY3OWViZGI) or create a post on the [Agility Developer Community](https://help.agilitycms.com/hc/en-us/community/topics).
