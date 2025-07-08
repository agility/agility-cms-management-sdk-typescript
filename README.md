# Agility CMS & Management API TypeScript SDK

## Table of Contents

- [About the Management API SDK](#about-the-management-api-sdk)
- [Getting Started](#getting-started)
- [Authentication & Setup](./docs/auth.md)
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
For detailed authentication instructions, including OAuth 2.0 setup, token management, and security best practices, see the **[Authentication & Setup Guide](./docs/auth.md)**.

### Making a Request

#### Simple OAuth Authentication (Recommended)
```typescript
import * as mgmtApi from "@agility/management-sdk";

// Simple OAuth authentication - tokens managed automatically
const apiClient = new mgmtApi.ApiClient();
await apiClient.auth();

const guid = "your-website-guid";
const locale = "en-us";

// Make authenticated request - token refresh handled automatically
const contentItem = await apiClient.contentMethods.getContentItem(22, guid, locale);
console.log(JSON.stringify(contentItem));
```

#### Manual Token Authentication (For CI/CD)
```typescript
import * as mgmtApi from "@agility/management-sdk";

// Token-based approach for CI/CD and automated environments
const options = new mgmtApi.Options();
options.token = process.env.AGILITY_API_TOKEN;
const apiClient = new mgmtApi.ApiClient(options);

const guid = process.env.AGILITY_GUID;
const locale = "en-us";

const contentItem = await apiClient.contentMethods.getContentItem(22, guid, locale);
console.log('Content retrieved:', contentItem.fields.title);
```

> 💡 **Note**: The new OAuth authentication requires `keytar` for secure token storage. See the [Authentication & Setup Guide](./docs/auth.md) for OAuth setup or [CI/CD & Automated Environments](./docs/cicd.md) for token-based authentication.

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
  - [getPage](./docs/page-methods.md#getpage), [getPageByPath](./docs/page-methods.md#getpagebypath), [getPageHistory](./docs/page-methods.md#getpagehistory), [getPageComments](./docs/page-methods.md#getpagecomments), [getPageList](./docs/page-methods.md#getpagelist), [getPageListByPageTemplateID](./docs/page-methods.md#getpagelistbypagetemplateid), [getPageListByPage](./docs/page-methods.md#getpagelistbypage), [getPageListByPageAndPageTemplateID](./docs/page-methods.md#getpagelistbypageandpagetemplateid), [getPageTree](./docs/page-methods.md#getpagetree), [getPageTemplateList](./docs/page-methods.md#getpagetemplatelist), [getPageSecurity](./docs/page-methods.md#getpagesecurity), [getPageItemTemplateList](./docs/page-methods.md#getpageitemtemplatelist), [getPageContentZones](./docs/page-methods.md#getpagecontentzones), [savePage](./docs/page-methods.md#savepage), [savePageSecurity](./docs/page-methods.md#savepagesecurity), [movePageItem](./docs/page-methods.md#movepageitem), [deletePage](./docs/page-methods.md#deletepage)

### User Management
- **[InstanceMethods](./docs/instance-methods.md)** - Instance-level operations (1 function)
  - [getLocales](./docs/instance-methods.md#getlocales)

- **[InstanceUserMethods](./docs/instance-user-methods.md)** - Instance user management (3 functions)
  - [getUsers](./docs/instance-user-methods.md#getusers), [saveUser](./docs/instance-user-methods.md#saveuser), [deleteUser](./docs/instance-user-methods.md#deleteuser)

- **[ServerUserMethods](./docs/server-user-methods.md)** - Server user operations (2 functions)
  - [me](./docs/server-user-methods.md#me), [you](./docs/server-user-methods.md#you)

### Integration
- **[WebhookMethods](./docs/webhook-methods.md)** - Webhook management (4 functions)
  - [getWebhook](./docs/webhook-methods.md#getwebhook), [webhookList](./docs/webhook-methods.md#webhooklist), [saveWebhook](./docs/webhook-methods.md#savewebhook), [deleteWebhook](./docs/webhook-methods.md#deletewebhook)

### Multi-Instance Operations
- **[Multi-Instance Operations](./docs/multi-instance-operations.md)** - Advanced workflows for managing content across multiple instances and locales
  - Configuration-driven content creation across multiple environments
  - Parallel processing and batch operations
  - Performance optimization and error handling
  - Cross-instance synchronization and reporting

### CI/CD & Automation
- **[CI/CD & Automated Environments](./docs/cicd.md)** - Token-based authentication for automated environments
  - CI/CD pipeline examples (GitHub Actions, GitLab CI, Jenkins)
  - Serverless functions (AWS Lambda, Vercel)
  - Environment configuration and security best practices
  - Token management and rotation

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
import * as mgmtApi from '@agility/management-sdk';

// Authenticate with simple OAuth flow
const client = new mgmtApi.ApiClient();
await client.auth();

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
