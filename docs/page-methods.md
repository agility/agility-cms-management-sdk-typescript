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
- [movePageItem](#movepageitem) - Moves a page item within the hierarchy
- [deletePage](#deletepage) - Deletes a page by ID

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

Retrieves the version history for a specific page.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pageID` | `number` | Yes | The page ID |
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `PageHistory[]` - Array of historical versions

**Usage Example:**
```typescript
const history = await apiClient.pageMethods.getPageHistory(123, guid);
console.log(`Found ${history.length} historical versions`);

// Display version details
history.forEach((version, index) => {
    console.log(`Version ${index + 1}:`);
    console.log(`  Date: ${version.modifiedDate}`);
    console.log(`  User: ${version.modifiedByUser}`);
    console.log(`  Action: ${version.action}`);
    console.log(`  Notes: ${version.notes}`);
});

// Get latest version
const latestVersion = history[0];
console.log('Latest change:', latestVersion.action);
```

**Error Handling:**
- Throws `Exception` when page not found

### getPageComments

Retrieves all comments for a specific page.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pageID` | `number` | Yes | The page ID |
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `ItemComments[]` - Array of page comments

**Usage Example:**
```typescript
const comments = await apiClient.pageMethods.getPageComments(123, guid);
console.log(`Found ${comments.length} comments`);

// Display comments
comments.forEach(comment => {
    console.log(`${comment.userName} (${comment.date}):`);
    console.log(`  ${comment.comment}`);
    console.log(`  Status: ${comment.status}`);
});
```

**Error Handling:**
- Throws `Exception` when page not found

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

### movePageItem

Moves a page item within the page hierarchy.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pageID` | `number` | Yes | The page ID to move |
| `parentPageID` | `number` | Yes | The new parent page ID (0 for root level) |
| `sortOrder` | `number` | Yes | The sort order within the parent |
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `PageItem` - Updated page object

**Usage Example:**
```typescript
// Move page to root level
const movedPage = await apiClient.pageMethods.movePageItem(123, 0, 1, guid);

// Move page under another page
const childPage = await apiClient.pageMethods.movePageItem(123, 456, 2, guid);

// Reorder pages
const reorderPages = async (parentID, pageIDs) => {
    for (let i = 0; i < pageIDs.length; i++) {
        await apiClient.pageMethods.movePageItem(
            pageIDs[i], 
            parentID, 
            i + 1, 
            guid
        );
    }
};
```

**Error Handling:**
- Throws `Exception` when page not found or move operation fails

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