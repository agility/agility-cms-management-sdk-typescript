# Agility CMS & Management API TypeScript SDK

## About the Management API SDK

- Provides a facility to developers to use the new Agility Management API more effectively.
- Provides methods to perform operations on Assets, Batches, Containers, Content, Models, Pages, and Users.
- Supports the creation of Pages and Content in batches.
- **Full batch workflow management** - Create, manage, and process batches with publish, unpublish, approve, decline, and request approval operations.
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
import * as mgmtApi from "./index";

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

4. Create an object of Method class(es), which can be used to create and perform operations. Following is the description of Classes and their respective methods -

### Making a Request
```Javascript
import * as mgmtApi from "./index";

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
This class is used to perform operations related to Batches. Batches allow you to group multiple content operations (publish, unpublish, approve, etc.) and execute them together. The following are the methods:

### getBatch
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `batchID` | `number` | The batchID of the requested batch.|
| `guid` | `string` | Current website guid.|
| `expandItems` | `boolean` | *(Optional)* Whether to include item-level information. Default: `true`|

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
// Publish batch and wait for completion
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

### createBatch
Creates a new empty batch with custom settings.

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `request` | `CreateBatchRequest` | Configuration object for the new batch.|
| `guid` | `string` | Current website guid.|

Returns: A ```number``` representing the newly created batch ID.

**CreateBatchRequest Interface:**
```typescript
interface CreateBatchRequest {
    batchName?: string;           // Custom name for the batch
    operationType?: BatchOperationType; // Default operation type
    isPrivate?: boolean;          // Whether batch is private (default: true)
    comments?: string;            // Optional comments
}
```

```javascript
// Create a custom batch
const batchId = await apiClient.batchMethods.createBatch({
    batchName: "Content Update Batch",
    operationType: BatchOperationType.Publish,
    isPrivate: true,
    comments: "Publishing Q4 content updates"
}, guid);
```

### addItemToBatch
Adds an item to an existing batch.

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `batchID` | `number` | The batchID to add the item to.|
| `request` | `AddBatchItemRequest` | The item details to add.|
| `guid` | `string` | Current website guid.|

Returns: A ```number``` representing the batch ID.

**AddBatchItemRequest Interface:**
```typescript
interface AddBatchItemRequest {
    itemType: BatchItemType;      // Type of item (Page, ContentItem, etc.)
    itemID: number;              // ID of the item to add
    languageCode: string;        // Language code (e.g., "en-us")
    itemTitle?: string;          // Optional title for the item
}
```

```javascript
// Add a content item to batch
await apiClient.batchMethods.addItemToBatch(123, {
    itemType: BatchItemType.ContentItem,
    itemID: 456,
    languageCode: "en-us",
    itemTitle: "My Content Item"
}, guid);
```

### removeItemFromBatch
Removes an item from an existing batch.

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `batchID` | `number` | The batchID to remove the item from.|
| `itemId` | `number` | The batchItemID to remove.|
| `guid` | `string` | Current website guid.|

Returns: A ```number``` representing the batch ID.

### processBatch
Processes a batch with a specified operation type and optional comments.

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `batchID` | `number` | The batchID to process.|
| `request` | `ProcessBatchRequest` | The processing configuration.|
| `guid` | `string` | Current website guid.|
| `returnBatchId` | `boolean` | *(Optional)* If `true`, returns batch ID immediately. If `false` (default), waits for completion.|

Returns: A ```number``` representing the batch ID.

**ProcessBatchRequest Interface:**
```typescript
interface ProcessBatchRequest {
    operationType: BatchOperationType; // The operation to perform
    comments?: string;                 // Optional comments for audit trail
}
```

```javascript
// Process batch with custom operation type
await apiClient.batchMethods.processBatch(123, {
    operationType: BatchOperationType.Approve,
    comments: "Approved by content manager"
}, guid);
```

### Common Batch Workflow Example
```javascript
import { BatchOperationType, BatchItemType } from 'agility-cms-management-sdk-typescript';

// 1. Create a new batch
const batchId = await apiClient.batchMethods.createBatch({
    batchName: "Weekly Content Update",
    operationType: BatchOperationType.Publish,
    isPrivate: false,
    comments: "Publishing weekly blog posts and updates"
}, guid);

// 2. Add multiple items to the batch
await apiClient.batchMethods.addItemToBatch(batchId, {
    itemType: BatchItemType.ContentItem,
    itemID: 101,
    languageCode: "en-us",
    itemTitle: "Blog Post 1"
}, guid);

await apiClient.batchMethods.addItemToBatch(batchId, {
    itemType: BatchItemType.Page,
    itemID: 202,
    languageCode: "en-us",
    itemTitle: "Homepage Update"
}, guid);

// 3. Publish the entire batch
await apiClient.batchMethods.publishBatch(batchId, guid);

// 4. Check batch status
const completedBatch = await apiClient.batchMethods.getBatch(batchId, guid);
console.log(`Batch ${completedBatch.batchName} completed with ${completedBatch.batchItemCount} items`);
```

### Available Enums
```typescript
// Batch operation types
enum BatchOperationType {
    Publish = 1,
    Unpublish = 2,
    Approve = 3,
    Decline = 4,
    RequestApproval = 5,
    // ... other operation types
}

// Batch item types
enum BatchItemType {
    Page = 1,
    ContentItem = 2,
    ContentList = 3,
    Tag = 4,
    ModuleDef = 5
}

// Batch states
enum BatchState {
    None = 0,
    Pending = 1,
    InProcess = 2,
    Processed = 3,
    Deleted = 4
}
```

## Class ContainerMethods
This class is used to perform operations related to Containers. The following are the methods: -

### getContainerByID
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `number` | The container id of the requested container.|
| `guid` | `string` | Current website guid.|

Returns: A object of ```Container``` class.

### getContainersByModel
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `modelId` | `number` | The model id of the requested container.|
| `guid` | `string` | Current website guid.|

Returns: A object of ```Container``` class.

### getContainerByReferenceName
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `referenceName` | `string` | The container reference name of the requested container.|
| `guid` | `string` | Current website guid.|

Returns: A object of ```Container``` class.

### getContainerSecurity
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `number` | The container id of the requested container.|
| `guid` | `string` | Current website guid.|

Returns: A object of ```Container``` class.

### getContainerList
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `guid` | `string` | Current website guid.|
Returns: A collection object of ```Container``` class.

### getNotificationList
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `number` | The container id of the requested container.|
| `guid` | `string` | Current website guid.|
Returns: A collection object of ```Notification``` class.

### saveContainer
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `container` | `Container` | A Container type object to create or update a container.|
| `guid` | `string` | Current website guid.|

Returns: An object of ```Container``` class.

### deleteContainer
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `number` | The container id of the requested container.|
| `guid` | `string` | Current website guid.|
Returns: A ```string``` response if a container has been deleted.

## Class ContentMethods
This class is used to perform operations related to Content. The following are the methods: -

### getContentItem
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `contentID` | `number` | The contentid of the requested content.|
| `guid` | `string` | Current website guid.|
| `locale` | `string` | Current website locale.|

Returns: An object of ```ContentItem``` class.

### publishContent
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `contentID` | `number` | The contentid of the requested content.|
| `guid` | `string` | Current website guid.|
| `locale` | `string` | Current website locale.|
| `comments` | `string` | Additional comments for a batch request.|

Returns: An array of ```contentID``` of the requested content.

### unPublishContent
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `contentID` | `number` | The contentid of the requested content.|
| `guid` | `string` | Current website guid.|
| `locale` | `string` | Current website locale.|
| `comments` | `string` | Additional comments for a batch request.|

Returns: An array of ```contentID``` of the requested content.

### contentRequestApproval
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `contentID` | `number` | The contentid of the requested content.|
| `guid` | `string` | Current website guid.|
| `locale` | `string` | Current website locale.|
| `comments` | `string` | Additional comments for a batch request.|

Returns: An array of ```contentID``` of the requested content.

### approveContent
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `contentID` | `number` | The contentid of the requested content.|
| `guid` | `string` | Current website guid.|
| `locale` | `string` | Current website locale.|
| `comments` | `string` | Additional comments for a batch request.|

Returns: An array of ```contentID``` of the requested content.

### declineContent
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `contentID` | `number` | The contentid of the requested content.|
| `guid` | `string` | Current website guid.|
| `locale` | `string` | Current website locale.|
| `comments` | `string` | Additional comments for a batch request.|

Returns: An array of ```contentID``` of the requested content.

### saveContentItem
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `contentItem` | `ContentItem` | A contentItem object to create or update a content.|
| `guid` | `string` | Current website guid.|
| `locale` | `string` | Current website locale.|

Returns: An array of ```contentID``` of the requested content.

### saveContentItems
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `contentItems` | `ContentItem[]` | A collection of contentItems object to create or update multiple contents.|
| `guid` | `string` | Current website guid.|
| `locale` | `string` | Current website locale.|

Returns: An array of ```contentID``` of the requested content.

### deleteContent
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `contentID` | `number` | The contentid of the requested content.|
| `guid` | `string` | Current website guid.|
| `locale` | `string` | Current website locale.|
| `comments` | `string` | Additional comments for a batch request.|

Returns: An array of ```contentID``` of the requested content.

### getContentItems
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `referenceName` | `string` | The reference name of the container for the requested content.|
| `guid` | `string` | Current website guid.|
| `locale` | `string` | Current website locale.|
| `listParams` | `ListParams` | The parameters list to apply filter on the content list.|

Returns: An object of ```ContentList``` class of the requested content.

### getContentList
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `referenceName` | `string` | The reference name of the container for the requested content.|
| `guid` | `string` | Current website guid.|
| `locale` | `string` | Current website locale.|
| `listParams` | `ListParams` | The parameters list to apply filter on the content list.|
| `filterObject` | `ContentListFilterModel` | To apply filter at the field level.|

Returns: An object of ```ContentList``` class of the requested content.

### getContentHistory
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `locale` | `string` | Current website locale.|
| `guid` | `string` | Current website guid.|
| `contentID` | `number` | The contentID of the requested content.|
| `take` | `number` | The number of items per record set default value 50.|
| `skip` | `number` | The skip level on the record set default value 0.|

Returns: An object of ```ContentItemHistory``` class of the requested content history.

### getContentComments
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `locale` | `string` | Current website locale.|
| `guid` | `string` | Current website guid.|
| `contentID` | `number` | The contentID of the requested content.|
| `take` | `number` | The number of items per record set default value 50.|
| `skip` | `number` | The skip level on the record set default value 0.|

Returns: An object of ```ItemComments``` class of the requested content comments.

## Class InstanceUserMethods
This class is used to perform operations related to User. The following are the methods: -

### getUsers
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `guid` | `string` | Current website guid.|
Returns: A collection of ```WebsiteUser``` class of the requested content.

### saveUser
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `emailAddress` | `string` | The email address of the requested user.|
| `roles` | `InstanceRole[]` | Collection object of InstanceRole class for the requested user.|
| `guid` | `string` | Current website guid.|
| `firstName` | `string` | The first name of the requested user.|
| `lastName` | `string` | The last name of the requested user.|

Returns: An object of the ```InstanceUser``` class.

### deleteUser
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `userID` | `number` | The userID of the requested user.|
| `guid` | `string` | Current website guid.|

Returns: A ```string``` response if a user has been deleted.

## Class ModelMethods
This class is used to perform operations related to Models. The following are the methods: -

### getContentModel
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `number` | The id of the requested model.|
| `guid` | `string` | Current website guid.|

Returns: An object of ```Model``` class.

### GetModelByReferenceName
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `referenceName` | `string` | The referenceName of the requested model.|
| `guid` | `string` | The guid of the requested model.|

### getContentModules
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `includeDefaults` | `bool` | Boolean value to include defaults.|
| `guid` | `string` | Current website guid.|
| `includeModules` | `bool` | Boolean value to include modules.|

Returns: A collection object of ```Model``` class.

### getPageModules
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `includeDefault` | `bool` | Boolean value to include defaults.|
| `guid` | `string` | Current website guid.|

Returns: A collection object of ```Model``` class.

### saveModel
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `model` | `Model` | The object of Model to for the requested model.|
| `guid` | `string` | Current website guid.|

Returns: An object of ```Model``` class.

### deleteModel
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `number` | The id for the requested model.|
| `guid` | `string` | Current website guid.|

Returns: A ```string``` response if a model is deleted.

## Class PageMethods
This class is used to perform operations related to Pages. The following are the methods: -

### getSitemap
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `guid` | `string` | Current website guid.|
| `locale` | `string` | Current website locale.|
Returns: A collection object of ```Sitemap``` class.

### getPageTemplates
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `guid` | `string` | Current website guid.|
| `locale` | `string` | Current website locale.|
| `includeModuleZones` | `boolean` | To include zones in the result set.|
| `searchFilter` | `string` | To apply search criteria on the requested page template.|
Returns: A collection object of ```PageModel``` class.

### getPageTemplate
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `guid` | `string` | Current website guid.|
| `locale` | `string` | Current website locale.|
| `pageTemplateId` | `number` | The pageTemplateId of the requested page template.|
Returns: An object of ```PageModel``` class.

### getPageTemplateName
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `guid` | `string` | Current website guid.|
| `locale` | `string` | Current website locale.|
| `templateName` | `string` | The templateName of the requested page template.|
Returns: An object of ```PageModel``` class.

### deletePageTemplate
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `guid` | `string` | Current website guid.|
| `locale` | `string` | Current website locale.|
| `pageTemplateId` | `string` | The pageTemplateId of the requested page template.|

### getPageItemTemplates
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `guid` | `string` | Current website guid.|
| `locale` | `string` | Current website locale.|
| `id` | `number` | The id of the requested page template.|
Returns: A collection of ```ContentSectionDefinition``` class.

### savePageTemplate
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `guid` | `string` | Current website guid.|
| `locale` | `string` | Current website locale.|
| `pageModel` | `PageModel` | The pageModel object of the requested page template.|
Returns: An object of ```PageModel``` class.

### getPage
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `pageID` | `number` | The id of the requested page.|
| `guid` | `string` | Current website guid.|
| `locale` | `string` | Current website locale.|

Returns: An object of ```PageItem``` class.

### publishPage
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `pageID` | `number` | The pageID of the requested page.|
| `guid` | `string` | Current website guid.|
| `locale` | `string` | Current website locale.|
| `comments` | `string` | Additional comments for a batch request.|

Returns: An array of ```pageID``` of the requested page.

### unPublishPage
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `pageID` | `number` | The pageID of the requested page.|
| `guid` | `string` | Current website guid.|
| `locale` | `string` | Current website locale.|
| `comments` | `string` | Additional comments for a batch request.|

Returns: An array of ```pageID``` of the requested page.

### deletePage
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `pageID` | `number` | The pageID of the requested page.|
| `guid` | `string` | Current website guid.|
| `locale` | `string` | Current website locale.|
| `comments` | `string` | Additional comments for a batch request.|

Returns: An array of ```pageID``` of the requested page.

### approvePage
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `pageID` | `number` | The pageID of the requested page.|
| `guid` | `string` | Current website guid.|
| `locale` | `string` | Current website locale.|
| `comments` | `string` | Additional comments for a batch request.|

Returns: An array of ```pageID``` of the requested page.

### declinePage
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `pageID` | `number` | The pageID of the requested page.|
| `guid` | `string` | Current website guid.|
| `locale` | `string` | Current website locale.|
| `comments` | `string` | Additional comments for a batch request.|

Returns: An array of ```pageID``` of the requested page.

### pageRequestApproval
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `pageID` | `number` | The pageID of the requested page.|
| `guid` | `string` | Current website guid.|
| `locale` | `string` | Current website locale.|
| `comments` | `string` | Additional comments for a batch request.|

Returns: An array of ```pageID``` of the requested page.

### savePage
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `pageItem` | `PageItem` | The object of PageItem class for the requested Page.|
| `guid` | `string` | Current website guid.|
| `locale` | `string` | Current website locale.|
| `parentPageID` | `number` | The id of the parent page.|
| `placeBeforePageItemID` | `number` | The id of the page before the page.|

Returns: An array of ```pageID``` of the requested page.

### getPageHistory
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `locale` | `string` | Current website locale.|
| `guid` | `string` | Current website guid.|
| `pageID` | `number` | The pageID of the requested page.|
| `take` | `number` | The number of items per record set default value 50.|
| `skip` | `number` | The skip level on the record set default value 0.|

Returns: An object of ```PageHistory``` class of the requested page history.

### getPageComments
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `locale` | `string` | Current website locale.|
| `guid` | `string` | Current website guid.|
| `pageID` | `number` | The pageID of the requested page.|
| `take` | `number` | The number of items per record set default value 50.|
| `skip` | `number` | The skip level on the record set default value 0.|

Returns: An object of ```ItemComments``` class of the requested page comments.

## Class ServerUserMethods
This class is used to perform operations related to Server User. The following are the methods: -

### me
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `guid` | `string` | Current website guid.|

Returns: An object of ```ServerUser``` class of the requested user.

### you
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `guid` | `string` | Current website guid.|
| `serverUserID` | `number` | Current website guid.|

Returns: An object of ```ServerUser``` class of the requested user.

## Class WebhookMethods
This class is used to perform operations related to Webhooks in the agility instance. The following are the methods: -

### webhookList
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `guid` | `string` | Current website guid.|
| `take` | `number` | The number of items per record set default value 20.|
| `skip` | `number` | The skip level on the record set default value 0.|

Returns: A list of webhooks configured in the instance.

### saveWebhook
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `guid` | `string` | Current website guid.|
| `webhook` | `Webhook` | An object of Webhook type with the webhook data.|

Returns: An object with the created Webhook.

### getWebhook
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `guid` | `string` | Current website guid.|
| `webhookID` | `string` | The webhookID of the requested webhook.|

Returns: An object with the requested Webhook.

### deleteWebhook
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `guid` | `string` | Current website guid.|
| `webhookID` | `string` | The webhookID of the requested webhook.|

## Class Instance

### getLocales
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `guid` | `string` | Current website guid.|

Returns: An array of locales. ex. ['en-us','fr-ca']

## Running the SDK Locally

- `npm run clean`
- `npm run prepare`
- `npm run build`

## How It Works

- [How Pages Work](https://help.agilitycms.com/hc/en-us/articles/4404222849677)
- [How Page Modules Work](https://help.agilitycms.com/hc/en-us/articles/4404222989453)
- [How Page Templates Work](https://help.agilitycms.com/hc/en-us/articles/4404229108877)

## Resources

### Agility CMS

- [Official site](https://agilitycms.com)
- [Documentation](https://help.agilitycms.com/hc/en-us)

### Community

- [Official Slack](https://join.slack.com/t/agilitycommunity/shared_invite/enQtNzI2NDc3MzU4Njc2LWI2OTNjZTI3ZGY1NWRiNTYzNmEyNmI0MGZlZTRkYzI3NmRjNzkxYmI5YTZjNTg2ZTk4NGUzNjg5NzY3OWViZGI)
- [Blog](https://agilitycms.com/resources/posts)
- [GitHub](https://github.com/agility)
- [Forums](https://help.agilitycms.com/hc/en-us/community/topics)
- [Facebook](https://www.facebook.com/AgilityCMS/)
- [Twitter](https://twitter.com/AgilityCMS)

## Feedback and Questions

If you have feedback or questions about this starter, please use the [Github Issues](https://github.com/agility/agility-cms-management-sdk-typescript/issues) on this repo, join our [Community Slack Channel](https://join.slack.com/t/agilitycommunity/shared_invite/enQtNzI2NDc3MzU4Njc2LWI2OTNjZTI3ZGY1NWRiNTYzNmEyNmI0MGZlZTRkYzI3NmRjNzkxYmI5YTZjNTg2ZTk4NGUzNjg5NzY3OWViZGI) or create a post on the [Agility Developer Community](https://help.agilitycms.com/hc/en-us/community/topics).