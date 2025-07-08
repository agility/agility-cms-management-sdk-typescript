# Agility CMS & Management API TypeScript SDK

## Table of Contents

- [About the Management API SDK](#about-the-management-api-sdk)
- [Getting Started](#getting-started)
- [API Method Classes](#api-method-classes)
- [Examples](#examples)
- [TypeScript Interfaces](#typescript-interfaces)
- [Available Enums](#available-enums)

---

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

## API Method Classes

### File and Media Management
- **[AssetMethods](./docs/asset-methods.md)** - File and media management operations (15 functions)
  - [deleteFile](./docs/asset-methods.md#deletefile), [moveFile](./docs/asset-methods.md#movefile), [getMediaList](./docs/asset-methods.md#getmedialist), [getGalleries](./docs/asset-methods.md#getgalleries), [getGalleryById](./docs/asset-methods.md#getgallerybyid), [getGalleryByName](./docs/asset-methods.md#getgallerybyname), [getDefaultContainer](./docs/asset-methods.md#getdefaultcontainer), [saveGallery](./docs/asset-methods.md#savegallery), [deleteGallery](./docs/asset-methods.md#deletegallery), [getAssetByID](./docs/asset-methods.md#getassetbyid), [getAssetByUrl](./docs/asset-methods.md#getassetbyurl), [upload](./docs/asset-methods.md#upload), [createFolder](./docs/asset-methods.md#createfolder), [deleteFolder](./docs/asset-methods.md#deletefolder), [renameFolder](./docs/asset-methods.md#renamefolder)

### Workflow Operations
- **[BatchMethods](./docs/batch-methods.md)** - Batch workflow operations (7 functions)
  - [getBatch](./docs/batch-methods.md#getbatch), [publishBatch](./docs/batch-methods.md#publishbatch), [unpublishBatch](./docs/batch-methods.md#unpublishbatch), [approveBatch](./docs/batch-methods.md#approvebatch), [declineBatch](./docs/batch-methods.md#declinebatch), [requestApprovalBatch](./docs/batch-methods.md#requestapprovalbatch), [getBatchTypes](./docs/batch-methods.md#getbatchtypes)

### Content Management
- **[ContainerMethods](./docs/container-methods.md)** - Container management operations (8 functions)
  - [getContainerByID](./docs/container-methods.md#getcontainerbyid), [getContainersByModel](./docs/container-methods.md#getcontainersbymodel), [getContainerByReferenceName](./docs/container-methods.md#getcontainerbyreferencename), [getContainerSecurity](./docs/container-methods.md#getcontainersecurity), [getContainerList](./docs/container-methods.md#getcontainerlist), [getNotificationList](./docs/container-methods.md#getnotificationlist), [saveContainer](./docs/container-methods.md#savecontainer), [deleteContainer](./docs/container-methods.md#deletecontainer)

- **[ContentMethods](./docs/content-methods.md)** - Content item operations (13 functions)
  - [getContentItem](./docs/content-methods.md#getcontentitem), [publishContent](./docs/content-methods.md#publishcontent), [unPublishContent](./docs/content-methods.md#unpublishcontent), [contentRequestApproval](./docs/content-methods.md#contentrequestapproval), [approveContent](./docs/content-methods.md#approvecontent), [declineContent](./docs/content-methods.md#declinecontent), [deleteContent](./docs/content-methods.md#deletecontent), [saveContentItem](./docs/content-methods.md#savecontentitem), [saveContentItems](./docs/content-methods.md#savecontentitems), [getContentItems](./docs/content-methods.md#getcontentitems), [getContentList](./docs/content-methods.md#getcontentlist), [getContentHistory](./docs/content-methods.md#getcontenthistory), [getContentComments](./docs/content-methods.md#getcontentcomments)

- **[ModelMethods](./docs/model-methods.md)** - Content model operations (6 functions)
  - [getContentModel](./docs/model-methods.md#getcontentmodel), [getModelByReferenceName](./docs/model-methods.md#getmodelbyreferencename), [getContentModules](./docs/model-methods.md#getcontentmodules), [getPageModules](./docs/model-methods.md#getpagemodules), [saveModel](./docs/model-methods.md#savemodel), [deleteModel](./docs/model-methods.md#deletemodel)

### Page Management
- **[PageMethods](./docs/page-methods.md)** - Page management operations (17 functions)
  - [getSitemap](./docs/page-methods.md#getsitemap), [getPageTemplates](./docs/page-methods.md#getpagetemplates), [getPageTemplate](./docs/page-methods.md#getpagetemplate), [getPageTemplateName](./docs/page-methods.md#getpagetemplatename), [deletePageTemplate](./docs/page-methods.md#deletepagetemplate), [getPageItemTemplates](./docs/page-methods.md#getpageitemtemplates), [savePageTemplate](./docs/page-methods.md#savepagetemplate), [getPage](./docs/page-methods.md#getpage), [publishPage](./docs/page-methods.md#publishpage), [unPublishPage](./docs/page-methods.md#unpublishpage), [pageRequestApproval](./docs/page-methods.md#pagerequestapproval), [approvePage](./docs/page-methods.md#approvepage), [declinePage](./docs/page-methods.md#declinepage), [deletePage](./docs/page-methods.md#deletepage), [savePage](./docs/page-methods.md#savepage), [getPageHistory](./docs/page-methods.md#getpagehistory), [getPageComments](./docs/page-methods.md#getpagecomments)

### User Management
- **[InstanceMethods](./docs/instance-methods.md)** - Instance-level operations (1 function)
  - [getLocales](./docs/instance-methods.md#getlocales)

- **[InstanceUserMethods](./docs/instance-user-methods.md)** - Instance user management (3 functions)
  - [getUsers](./docs/instance-user-methods.md#getusers), [saveUser](./docs/instance-user-methods.md#saveuser), [deleteUser](./docs/instance-user-methods.md#deleteuser)

- **[ServerUserMethods](./docs/server-user-methods.md)** - Server user operations (2 functions)
  - [me](./docs/server-user-methods.md#me), [you](./docs/server-user-methods.md#you)

### Integration
- **[WebhookMethods](./docs/webhook-methods.md)** - Webhook management (4 functions)
  - [webhookList](./docs/webhook-methods.md#webhooklist), [saveWebhook](./docs/webhook-methods.md#savewebhook), [getWebhook](./docs/webhook-methods.md#getwebhook), [deleteWebhook](./docs/webhook-methods.md#deletewebhook)

## Examples

### Understanding Agility CMS Batch Architecture

Agility CMS uses a simple approach for working with content and batches:

#### Content/Page Creation (Handled by Respective Controllers)
- **contentMethods.saveContentItem()** - Creates a single new content item and adds it to a batch
- **contentMethods.saveContentItems()** - Creates multiple new content items and adds them to a batch  
- **pageMethods.savePage()** - Creates a new page and adds it to a batch
- These methods create the content AND automatically handle batch creation/management

#### Batch Workflow Operations (Handled by Batch Controller)
- **batchMethods.publishBatch()** - Publishes all items in an existing batch
- **batchMethods.unpublishBatch()** - Unpublishes all items in an existing batch
- **batchMethods.approveBatch()** - Approves all items in an existing batch
- **batchMethods.declineBatch()** - Declines all items in an existing batch
- **batchMethods.requestApprovalBatch()** - Requests approval for all items in an existing batch
- **batchMethods.getBatch()** - Retrieves details of an existing batch
- **batchMethods.getBatchTypes()** - Retrieves all batch-related enum types for developer discovery

### Complete Workflow Example

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
