# Agility CMS & Management API TypeScript SDK

## PageMethods

This class provides comprehensive page management operations for Agility CMS. Pages are the structural foundation of your website, defining the navigation hierarchy and content organization.

**Important Notes:**
- Pages define the structure and navigation of your website
- Each page has a unique path and can contain multiple content zones
- Pages support workflow states (published, unpublished, approved, etc.)
- Page operations support both immediate return and batch processing
- Page templates define the layout and content zones available
- Pages can be organized in a hierarchical structure with parent-child relationships

### Function List
- [getPage](#getpage) - Retrieves a specific page by ID
- [getPageByPath](#getpagebypath) - Retrieves a page by its URL path
- [getPageHistory](#getpagehistory) - Retrieves version history for a page
- [getPageComments](#getpagecomments) - Retrieves comments for a page
- [getPageList](#getpagelist) - Retrieves list of pages with filtering
- [getPageListByPageTemplateID](#getpagelistbypagetemplateid) - Retrieves pages using specific template
- [getPageListByPage](#getpagelistbypage) - Retrieves pages with pagination
- [getPageListByPageAndPageTemplateID](#getpagelistbypageandpagetemplateid) - Retrieves paginated pages by template
- [getPageTree](#getpagetree) - Retrieves complete page hierarchy
- [getPageTemplateList](#getpagetemplatelist) - Retrieves available page templates
- [getPageSecurity](#getpagesecurity) - Retrieves security settings for a page
- [getPageItemTemplateList](#getpageitemtemplatelist) - Retrieves page item templates
- [getPageContentZones](#getpagecontentzones) - Retrieves content zones for a page
- [savePage](#savepage) - Creates or updates a page
- [savePageSecurity](#savepagesecurity) - Updates page security settings
- [movePage](#movepage) - Moves a page under a parent, before a sibling
- [deletePage](#deletepage) - Deletes a page by ID
- [batchWorkflowPages](#batchworkflowpages) - Batch workflow operation on multiple pages

---

### getPage

Retrieves a specific page by its unique ID.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pageID` | `number` | Yes | The page ID to retrieve |
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `PageItem` - Complete page object with content zones and metadata

**Usage Example:**
```typescript
const page = await apiClient.pageMethods.getPage(123, guid);
console.log('Page title:', page.title);
console.log('Page path:', page.path);
console.log('Page template:', page.templateName);
console.log('Last modified:', page.modifiedDate);
console.log('Content zones:', page.contentZones.length);

// Display content zones
page.contentZones.forEach(zone => {
    console.log(`Zone: ${zone.name}`);
    console.log(`  Items: ${zone.items.length}`);
});
```

**Error Handling:**
- Throws `Exception` when page not found

### getPageByPath

Retrieves a page by its URL path.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `path` | `string` | Yes | The URL path of the page (e.g., '/about-us') |
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `PageItem` - Page object matching the path

**Usage Example:**
```typescript
const page = await apiClient.pageMethods.getPageByPath('/about-us', guid);
if (page) {
    console.log('Page found:', page.title);
    console.log('Page ID:', page.pageID);
    console.log('Template:', page.templateName);
} else {
    console.log('Page not found at path');
}

// Validate page paths
const validatePath = async (path) => {
    try {
        const page = await apiClient.pageMethods.getPageByPath(path, guid);
        return page !== null;
    } catch (error) {
        return false;
    }
};

if (await validatePath('/blog')) {
    console.log('Blog page exists');
}
```

**Error Handling:**
- Throws `Exception` when page not found or path invalid

### getPageHistory

Retrieves the version history for a specific page, newest first.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `locale` | `string` | Yes | The locale code (e.g. `en-us`) |
| `guid` | `string` | Yes | Current website GUID |
| `pageID` | `number` | Yes | The page ID |
| `take` | `number` | No | How many versions to return (default 50) |
| `skip` | `number` | No | How many versions to skip (default 0) |

**Returns:** `PageHistoryResponse` - `items` (the versions on this page of results) and `totalCount`

**Usage Example:**
```typescript
const history = await apiClient.pageMethods.getPageHistory("en-us", guid, 123);
console.log(`${history.totalCount} versions`);

history.items.forEach(version => {
    console.log(`v${version.VersionNumber} ${version.State} by ${version.CreatedBy} on ${version.CreatedDate}`);
    if (version.Comment) console.log(`  Comment: ${version.Comment}`);
});
```

**Error Handling:**
- Throws `Exception` when the request fails

### getPageComments

Retrieves the comments on a specific page.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `locale` | `string` | Yes | The locale code (e.g. `en-us`) |
| `guid` | `string` | Yes | Current website GUID |
| `pageID` | `number` | Yes | The page ID |
| `take` | `number` | No | How many comments to return (default 50) |
| `skip` | `number` | No | How many comments to skip (default 0) |

**Returns:** `ItemComments` - `items` (the comments on this page of results) and `totalCount`

**Usage Example:**
```typescript
const comments = await apiClient.pageMethods.getPageComments("en-us", guid, 123);
console.log(`${comments.totalCount} comments`);

comments.items.forEach(comment => {
    console.log(`${comment.createdBy} (${comment.createdOn}): ${comment.commentText}`);
});
```

**Error Handling:**
- Throws `Exception` when the request fails

### getPageList

Retrieves a list of pages with optional filtering and sorting.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `listParams` | `ListParams` | Yes | Filtering and sorting parameters |
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `PageItem[]` - Array of page items

**Usage Example:**
```typescript
// Get all pages
const allPages = await apiClient.pageMethods.getPageList({}, guid);

// Get pages with filtering
const params = {
    filter: 'title contains "blog"',
    sort: 'modifiedDate desc',
    take: 10,
    skip: 0
};
const filteredPages = await apiClient.pageMethods.getPageList(params, guid);

// Get recently modified pages
const recentPages = await apiClient.pageMethods.getPageList({
    sort: 'modifiedDate desc',
    take: 5
}, guid);
```

**Error Handling:**
- Throws `Exception` when retrieval fails

### getPageListByPageTemplateID

Retrieves pages that use a specific page template.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pageTemplateID` | `number` | Yes | The page template ID |
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `PageItem[]` - Array of pages using the template

**Usage Example:**
```typescript
const pages = await apiClient.pageMethods.getPageListByPageTemplateID(456, guid);
console.log(`Found ${pages.length} pages using this template`);

// Group by status
const pagesByStatus = pages.reduce((acc, page) => {
    const status = page.state || 'draft';
    if (!acc[status]) acc[status] = [];
    acc[status].push(page);
    return acc;
}, {});

console.log('Pages by status:', pagesByStatus);
```

**Error Handling:**
- Throws `Exception` when template not found

### getPageListByPage

Retrieves pages with pagination support.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pageSize` | `number` | Yes | Number of pages per page |
| `pageNumber` | `number` | Yes | Page number (1-based) |
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `PageItem[]` - Array of pages for the specified page

**Usage Example:**
```typescript
const pageSize = 20;
const pageNumber = 1;

const firstPage = await apiClient.pageMethods.getPageListByPage(
    pageSize, 
    pageNumber, 
    guid
);
console.log(`Page ${pageNumber}: ${firstPage.length} pages`);

// Paginated processing
let currentPage = 1;
let hasMore = true;
while (hasMore) {
    const pageItems = await apiClient.pageMethods.getPageListByPage(
        pageSize, 
        currentPage, 
        guid
    );
    
    if (pageItems.length === 0) {
        hasMore = false;
    } else {
        console.log(`Processing page ${currentPage} with ${pageItems.length} pages`);
        // Process pages...
        currentPage++;
    }
}
```

**Error Handling:**
- Throws `Exception` when retrieval fails

### getPageListByPageAndPageTemplateID

Retrieves paginated pages filtered by template.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pageTemplateID` | `number` | Yes | The page template ID |
| `pageSize` | `number` | Yes | Number of pages per page |
| `pageNumber` | `number` | Yes | Page number (1-based) |
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `PageItem[]` - Array of pages for the specified page and template

**Usage Example:**
```typescript
const templatePages = await apiClient.pageMethods.getPageListByPageAndPageTemplateID(
    456, 
    10, 
    1, 
    guid
);
console.log(`Template pages: ${templatePages.length}`);
```

**Error Handling:**
- Throws `Exception` when template not found

### getPageTree

Retrieves the complete page hierarchy as a tree structure.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `PageItem[]` - Hierarchical array of pages with parent-child relationships

**Usage Example:**
```typescript
const pageTree = await apiClient.pageMethods.getPageTree(guid);
console.log(`Root pages: ${pageTree.length}`);

// Display page hierarchy
const displayPageTree = (pages, level = 0) => {
    pages.forEach(page => {
        const indent = '  '.repeat(level);
        console.log(`${indent}${page.title} (${page.path})`);
        
        if (page.children && page.children.length > 0) {
            displayPageTree(page.children, level + 1);
        }
    });
};

displayPageTree(pageTree);

// Find page by path in tree
const findPageInTree = (pages, targetPath) => {
    for (const page of pages) {
        if (page.path === targetPath) {
            return page;
        }
        if (page.children) {
            const found = findPageInTree(page.children, targetPath);
            if (found) return found;
        }
    }
    return null;
};

const aboutPage = findPageInTree(pageTree, '/about-us');
```

**Error Handling:**
- Throws `Exception` when retrieval fails

### getPageTemplateList

Retrieves all available page templates.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `PageTemplate[]` - Array of available page templates

**Usage Example:**
```typescript
const templates = await apiClient.pageMethods.getPageTemplateList(guid);
console.log(`Available templates: ${templates.length}`);

// Display template information
templates.forEach(template => {
    console.log(`Template: ${template.name}`);
    console.log(`  Description: ${template.description}`);
    console.log(`  Content Zones: ${template.contentZones.length}`);
    console.log(`  Template File: ${template.templateFile}`);
});

// Create template dropdown options
const templateOptions = templates.map(template => ({
    value: template.id,
    label: template.name,
    description: template.description
}));
```

**Error Handling:**
- Throws `Exception` when retrieval fails

### getPageSecurity

Retrieves security settings for a specific page.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pageID` | `number` | Yes | The page ID |
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `PageSecurity` - Page security configuration

**Usage Example:**
```typescript
const security = await apiClient.pageMethods.getPageSecurity(123, guid);
console.log('Page security settings:', security);

// Check if page is public
if (security.isPublic) {
    console.log('Page is publicly accessible');
} else {
    console.log('Page has restricted access');
    console.log('Allowed roles:', security.allowedRoles);
}
```

**Error Handling:**
- Throws `Exception` when page not found

### getPageItemTemplateList

Retrieves available page item templates.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `PageItemTemplate[]` - Array of page item templates

**Usage Example:**
```typescript
const itemTemplates = await apiClient.pageMethods.getPageItemTemplateList(guid);
console.log(`Available item templates: ${itemTemplates.length}`);

// Display template types
itemTemplates.forEach(template => {
    console.log(`Template: ${template.name}`);
    console.log(`  Type: ${template.type}`);
    console.log(`  Description: ${template.description}`);
});
```

**Error Handling:**
- Throws `Exception` when retrieval fails

### getPageContentZones

Retrieves content zones for a specific page.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pageID` | `number` | Yes | The page ID |
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `ContentZone[]` - Array of content zones

**Usage Example:**
```typescript
const zones = await apiClient.pageMethods.getPageContentZones(123, guid);
console.log(`Page has ${zones.length} content zones`);

// Display zone information
zones.forEach(zone => {
    console.log(`Zone: ${zone.name}`);
    console.log(`  Items: ${zone.items.length}`);
    console.log(`  Template: ${zone.templateName}`);
    
    // Display zone items
    zone.items.forEach(item => {
        console.log(`    Item: ${item.title} (${item.type})`);
    });
});
```

**Error Handling:**
- Throws `Exception` when page not found

### savePage

Creates a new page or updates an existing one.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `page` | `PageItem` | Yes | Page object to save |
| `guid` | `string` | Yes | Current website GUID |
| `returnBatchId` | `boolean` | No | If `true`, returns batch ID immediately. If `false` (default), waits for completion |

**Returns:** `PageItem | number` - Saved page (if `returnBatchId` is false) or batch ID (if true)

**Usage Example:**
```typescript
// Create a new page
const newPage = {
    title: 'New About Page',
    path: '/about-us',
    templateName: 'About Template',
    parentPageID: null, // Root level page
    menuText: 'About Us',
    isVisible: true,
    contentZones: [
        {
            name: 'MainContent',
            items: [
                {
                    type: 'content',
                    contentID: 456,
                    title: 'About Us Content'
                }
            ]
        }
    ]
};

const savedPage = await apiClient.pageMethods.savePage(newPage, guid);
console.log('Page created with ID:', savedPage.pageID);

// Update existing page
const existingPage = await apiClient.pageMethods.getPage(123, guid);
existingPage.title = 'Updated Page Title';
existingPage.menuText = 'Updated Menu';
const updatedPage = await apiClient.pageMethods.savePage(existingPage, guid);

// Save with batch processing
const batchId = await apiClient.pageMethods.savePage(newPage, guid, true);
console.log('Batch created with ID:', batchId);
```

**Error Handling:**
- Throws `Exception` when validation fails or save operation fails
- When it waits for the batch (`returnBatchId` false), throws `Exception` whose `innerError` is a `BatchFailedException` if the batch reports a failed item. With `returnBatchId` true, check the batch yourself with `batchMethods.getBatch`

**GEO / AEO and the extra SEO properties:**

A page can carry a top-level `geo` object (`schemaType`, `summary`, `structuredData`, `ai`) and four more `seo` properties (`title`, `canonicalUrl`, `robots`, `ogImage`). On save, each of these properties has three states:

| In the object you save | Effect |
|---|---|
| Property left out (`undefined`), or the whole `geo` left out | The stored value is kept |
| `geo: null` | The whole `geo` block is cleared |
| Property set to `null` | The stored value is cleared |
| Property set to a value | The stored value is replaced |

`savePage` sends the object as JSON, and `JSON.stringify` drops `undefined`, so a read-modify-save that doesn't touch these properties keeps them. Don't set them to `null` unless you mean to clear them. Responses leave out any property that isn't set.

```typescript
const page = await apiClient.pageMethods.getPage(123, guid, locale);
page.geo = {
    ...page.geo,
    schemaType: 'AboutPage',
    summary: 'Who we are, in two sentences.',
    structuredData: { '@context': 'https://schema.org', '@type': 'Organization', name: 'Example' },
    ai: { llmsInclude: 'include' }
};
page.seo = { ...page.seo, title: 'About us | Example', robots: { index: true, follow: true } };
await apiClient.pageMethods.savePage(page, guid, locale);

// Clear the summary only; everything else in geo is kept
await apiClient.pageMethods.savePage({ ...page, geo: { summary: null } }, guid, locale);

// Clear all of geo
await apiClient.pageMethods.savePage({ ...page, geo: null }, guid, locale);
```

### savePageSecurity

Updates security settings for a specific page.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pageID` | `number` | Yes | The page ID |
| `security` | `PageSecurity` | Yes | Security configuration to apply |
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `PageSecurity` - Updated security configuration

**Usage Example:**
```typescript
// Make page public
const publicSecurity = {
    isPublic: true,
    allowedRoles: [],
    requiresAuthentication: false
};

const updatedSecurity = await apiClient.pageMethods.savePageSecurity(
    123, 
    publicSecurity, 
    guid
);

// Restrict page to specific roles
const restrictedSecurity = {
    isPublic: false,
    allowedRoles: ['Administrator', 'Editor'],
    requiresAuthentication: true
};

await apiClient.pageMethods.savePageSecurity(123, restrictedSecurity, guid);
```

**Error Handling:**
- Throws `Exception` when page not found or security update fails

### movePage

Moves a page to a new place in its sitemap: under a parent page, before one of that parent's pages. This is the same move as dragging the page in the page tree.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pageID` | `number` | Yes | The page to move |
| `guid` | `string` | Yes | Current website GUID |
| `locale` | `string` | Yes | The locale to look the pages up in. The move applies to every locale |
| `parentPageID` | `number` | No | The new parent page, or -1 (default) for the root of the sitemap |
| `placeBeforePageID` | `number` | No | The page to place it before, or -1 (default) to place it last. Must already be under the new parent |

**Returns:** `PageMoveResult` - `{ pageID, parentPageID, versionID, moved, siblingPageIDs }`

A page's place is shared by all locales. The move creates a new version of the page and puts it in staging in every locale it exists in, so publish it for the live sitemap to show the new place. When the page is already directly before `placeBeforePageID` (or already last) under `parentPageID`, nothing changes and `moved` is `false`, so it's safe to call for every page you want in a given order. A page moves within its own sitemap only, and its child pages move with it.

**Usage Example:**
```typescript
// Place page 8 before page 10, under page 7
const result = await apiClient.pageMethods.movePage(8, guid, "en-us", 7, 10);
console.log(result.moved, result.siblingPageIDs); // true [15, 13, 11, 8, 10, 9]

// Move a page to the root of its sitemap, last
await apiClient.pageMethods.movePage(8, guid, "en-us");

// Put a parent's pages in a given order: place each page before the next one, from the end
const order = [15, 13, 11, 8, 10, 9];
for (let i = order.length - 1; i >= 0; i--) {
    await apiClient.pageMethods.movePage(order[i], guid, "en-us", 7, order[i + 1] ?? -1);
}
```

**Error Handling:**
- Throws `Exception` with `statusCode` 404 when the page, the parent or the page to place before isn't found
- Throws `Exception` with `statusCode` 400 when the move isn't allowed: under itself or one of its own pages, a page to place before that is under another parent, or another page with the same name or a dynamic page already at that level

### deletePage

Deletes a page by its ID.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pageID` | `number` | Yes | The page ID to delete |
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `string` - Confirmation message of successful deletion

**Usage Example:**
```typescript
try {
    const result = await apiClient.pageMethods.deletePage(123, guid);
    console.log(result); // "Page deleted successfully"
} catch (error) {
    if (error.message.includes('has children')) {
        console.log('Cannot delete page: has child pages');
    } else if (error.message.includes('referenced')) {
        console.log('Cannot delete page: referenced by other content');
    } else {
        console.error('Failed to delete page:', error.message);
    }
}

// Safe page deletion with checks
const safeDeletePage = async (pageID) => {
    try {
        const page = await apiClient.pageMethods.getPage(pageID, guid);
        
        // Check if page has children
        if (page.children && page.children.length > 0) {
            console.log(`Cannot delete page "${page.title}": has child pages`);
            return false;
        }
        
        // Perform deletion
        await apiClient.pageMethods.deletePage(pageID, guid);
        console.log('Page deleted successfully');
        return true;
    } catch (error) {
        console.error('Failed to delete page:', error.message);
        return false;
    }
};
```

**Error Handling:**
- Throws `Exception` when page not found, has children, or deletion fails

**Note:** Pages cannot be deleted if they have child pages or are referenced by other content.

---

### batchWorkflowPages

Performs a batch workflow operation on multiple pages. Supports Publish, Unpublish, Approve, Decline, and RequestApproval operations.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pageIDs` | `number[]` | Yes | Array of page IDs to process |
| `guid` | `string` | Yes | Current website GUID |
| `locale` | `string` | Yes | The locale code |
| `operation` | `WorkflowOperationType` | Yes | The workflow operation (Publish, Unpublish, Approve, Decline, RequestApproval) |
| `returnBatchId` | `boolean` | No | If `true`, returns batch ID immediately without waiting |

**Returns:** `Promise<number[]>` - Array of page IDs that were processed

**Usage Example:**
```typescript
import { WorkflowOperationType } from '@agility/management-sdk';

// Publish multiple pages
const pageIDs = [201, 202, 203];
const publishedPageIDs = await client.pageMethods.batchWorkflowPages(
    pageIDs, 
    'your-guid', 
    'en-us', 
    WorkflowOperationType.Publish
);
console.log('Published page IDs:', publishedPageIDs);

// Unpublish multiple pages
const unpublishedPageIDs = await client.pageMethods.batchWorkflowPages(
    pageIDs, 
    'your-guid', 
    'en-us', 
    WorkflowOperationType.Unpublish
);

// Request approval for multiple pages
const approvalRequestedPageIDs = await client.pageMethods.batchWorkflowPages(
    pageIDs, 
    'your-guid', 
    'en-us', 
    WorkflowOperationType.RequestApproval
);

// Approve multiple pages
const approvedPageIDs = await client.pageMethods.batchWorkflowPages(
    pageIDs, 
    'your-guid', 
    'en-us', 
    WorkflowOperationType.Approve
);

// Decline multiple pages
const declinedPageIDs = await client.pageMethods.batchWorkflowPages(
    pageIDs, 
    'your-guid', 
    'en-us', 
    WorkflowOperationType.Decline
);
```

**Error Handling:**
- Throws `Exception` when batch operation fails

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
- [ServerUserMethods](./server-user-methods.md)
- [WebhookMethods](./webhook-methods.md)
- [Multi-Instance Operations](./multi-instance-operations.md) 