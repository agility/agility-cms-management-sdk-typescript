# Agility CMS & Management API TypeScript SDK

## AssetMethods

This class provides comprehensive file and media management operations for the Agility CMS platform. It handles file uploads, downloads, folder management, and gallery operations.

**Important Notes:** 
- All file operations require proper authentication and valid GUID
- FormData uploads support multiple file types and formats
- Gallery operations are used for organizing media assets

### Function List
- [upload](#upload) - Uploads files to Agility CMS
- [deleteFile](#deletefile) - Deletes a specific file by media ID
- [moveFile](#movefile) - Moves a file to a different folder
- [getMediaList](#getmedialist) - Retrieves paginated list of media assets
- [getAssetByID](#getassetbyid) - Retrieves a specific media asset by ID
- [getAssetByUrl](#getassetbyurl) - Retrieves a media asset by URL
- [createFolder](#createfolder) - Creates a new folder in media library
- [deleteFolder](#deletefolder) - Deletes a folder from media library
- [renameFolder](#renamefolder) - Renames an existing folder
- [getGalleries](#getgalleries) - Retrieves list of media galleries
- [getGalleryById](#getgallerybyid) - Retrieves a specific gallery by ID
- [getGalleryByName](#getgallerybyname) - Retrieves a gallery by name
- [getDefaultContainer](#getdefaultcontainer) - Retrieves the default asset container
- [saveGallery](#savegallery) - Creates or updates a media gallery
- [deleteGallery](#deletegallery) - Deletes a gallery by ID

---

### upload

Uploads one or more files to a specified folder path in Agility CMS.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `formData` | `FormData` | Yes | FormData object containing files to upload |
| `agilityFolderPath` | `string` | Yes | Target folder path in Agility CMS |
| `guid` | `string` | Yes | Current website GUID |
| `groupingID` | `number` | No | Gallery grouping ID *(Optional, default: -1)* |

**Returns:** `Media[]` - Array of uploaded media objects

**Usage Example:**
```typescript
const form = new FormData();
form.append('files', file, 'myFile.jpg');

const uploadedFiles = await apiClient.assetMethods.upload(
    form, 
    '/images/products', 
    guid, 
    123
);
```

**Error Handling:**
- Throws `Exception` when upload fails or folder path is invalid

### deleteFile

Deletes a specific file from Agility CMS by its media ID.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `mediaID` | `number` | Yes | The media ID of the file to delete |
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `string` - Confirmation message of successful deletion

**Usage Example:**
```typescript
const result = await apiClient.assetMethods.deleteFile(12345, guid);
console.log(result); // "File deleted successfully"
```

**Error Handling:**
- Throws `Exception` when file not found or deletion fails

### moveFile

Moves a file to a different folder location within Agility CMS.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `mediaID` | `number` | Yes | The media ID of the file to move |
| `newFolder` | `string` | Yes | Target folder path |
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `Media` - Updated media object with new location

**Usage Example:**
```typescript
const movedFile = await apiClient.assetMethods.moveFile(
    12345, 
    '/images/archived', 
    guid
);
```

**Error Handling:**
- Throws `Exception` when file or target folder not found

### getMediaList

Retrieves a paginated list of media assets.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `pageSize` | `number` | Yes | Number of items per page |
| `recordOffset` | `number` | Yes | Number of records to skip |
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `AssetMediaList` - Paginated list of media assets

**Usage Example:**
```typescript
const mediaList = await apiClient.assetMethods.getMediaList(50, 0, guid);
console.log(`Total items: ${mediaList.totalCount}`);
```

**Error Handling:**
- Throws `Exception` when retrieval fails

### getAssetByID

Retrieves a specific media asset by its ID.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `mediaID` | `number` | Yes | The media ID to retrieve |
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `Media` - Media object with complete asset information

**Usage Example:**
```typescript
const asset = await apiClient.assetMethods.getAssetByID(12345, guid);
console.log(asset.url);
```

**Error Handling:**
- Throws `Exception` when asset not found

### getAssetByUrl

Retrieves a media asset by its URL.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | `string` | Yes | The URL of the asset to retrieve |
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `Media` - Media object matching the URL

**Usage Example:**
```typescript
const asset = await apiClient.assetMethods.getAssetByUrl(
    'https://cdn.agilitycms.com/myfile.jpg', 
    guid
);
```

**Error Handling:**
- Throws `Exception` when asset not found by URL

### createFolder

Creates a new folder in the Agility CMS media library.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `originKey` | `string` | Yes | Unique identifier for the folder |
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `Media` - Created folder object

**Usage Example:**
```typescript
const newFolder = await apiClient.assetMethods.createFolder(
    '/images/new-category', 
    guid
);
```

**Error Handling:**
- Throws `Exception` when folder creation fails or path already exists

### deleteFolder

Deletes a folder from the Agility CMS media library.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `originKey` | `string` | Yes | Folder path identifier |
| `guid` | `string` | Yes | Current website GUID |
| `mediaID` | `number` | No | Media ID of the folder *(Optional, default: 0)* |

**Returns:** `void` - No return value

**Usage Example:**
```typescript
await apiClient.assetMethods.deleteFolder('/images/old-category', guid, 456);
```

**Error Handling:**
- Throws `Exception` when folder not found or contains files

### renameFolder

Renames an existing folder in the media library.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `folderName` | `string` | Yes | Current folder name |
| `newFolderName` | `string` | Yes | New folder name |
| `guid` | `string` | Yes | Current website GUID |
| `mediaID` | `number` | No | Media ID of the folder *(Optional, default: 0)* |

**Returns:** `void` - No return value

**Usage Example:**
```typescript
await apiClient.assetMethods.renameFolder(
    'old-name', 
    'new-name', 
    guid, 
    456
);
```

**Error Handling:**
- Throws `Exception` when folder not found or name conflict exists

### getGalleries

Retrieves a list of media galleries with optional search filtering.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `guid` | `string` | Yes | Current website GUID |
| `search` | `string` | No | Search term to filter galleries *(Optional)* |
| `pageSize` | `number` | No | Number of galleries per page *(Optional)* |
| `rowIndex` | `number` | No | Starting row index *(Optional)* |

**Returns:** `assetGalleries` - Collection of gallery objects

**Usage Example:**
```typescript
const galleries = await apiClient.assetMethods.getGalleries(
    guid, 
    'product', 
    20, 
    0
);
```

**Error Handling:**
- Throws `Exception` when retrieval fails

### getGalleryById

Retrieves a specific gallery by its ID.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `guid` | `string` | Yes | Current website GUID |
| `id` | `number` | Yes | Gallery ID to retrieve |

**Returns:** `assetMediaGrouping` - Gallery object with metadata

**Usage Example:**
```typescript
const gallery = await apiClient.assetMethods.getGalleryById(guid, 123);
console.log(gallery.name);
```

**Error Handling:**
- Throws `Exception` when gallery not found

### getGalleryByName

Retrieves a gallery by its name.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `guid` | `string` | Yes | Current website GUID |
| `galleryName` | `string` | Yes | Name of the gallery to retrieve |

**Returns:** `assetMediaGrouping` - Gallery object matching the name

**Usage Example:**
```typescript
const gallery = await apiClient.assetMethods.getGalleryByName(
    guid, 
    'Product Images'
);
```

**Error Handling:**
- Throws `Exception` when gallery not found by name

### getDefaultContainer

Retrieves the default asset container for the website.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `assetContainer` - Default container configuration

**Usage Example:**
```typescript
const container = await apiClient.assetMethods.getDefaultContainer(guid);
console.log(container.name);
```

**Error Handling:**
- Throws `Exception` when container retrieval fails

### saveGallery

Creates or updates a media gallery.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `guid` | `string` | Yes | Current website GUID |
| `gallery` | `assetMediaGrouping` | Yes | Gallery object to save |

**Returns:** `assetMediaGrouping` - Saved gallery object with updated metadata

**Usage Example:**
```typescript
const gallery = {
    name: 'New Product Gallery',
    description: 'Images for product showcase'
};

const savedGallery = await apiClient.assetMethods.saveGallery(guid, gallery);
```

**Error Handling:**
- Throws `Exception` when save operation fails

### deleteGallery

Deletes a gallery by its ID.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `guid` | `string` | Yes | Current website GUID |
| `id` | `number` | Yes | Gallery ID to delete |

**Returns:** `string` - Confirmation message of successful deletion

**Usage Example:**
```typescript
const result = await apiClient.assetMethods.deleteGallery(guid, 123);
console.log(result); // "Gallery deleted successfully"
```

**Error Handling:**
- Throws `Exception` when gallery not found or deletion fails

---

## Navigation
- [← Back to Main Documentation](../README.md)
- [Authentication & Setup](./auth.md)
- [CI/CD & Automated Environments](./cicd.md)
- [BatchMethods](./batch-methods.md)
- [ContainerMethods](./container-methods.md)
- [ContentMethods](./content-methods.md)
- [InstanceMethods](./instance-methods.md)
- [InstanceUserMethods](./instance-user-methods.md)
- [ModelMethods](./model-methods.md)
- [PageMethods](./page-methods.md)
- [ServerUserMethods](./server-user-methods.md)
- [WebhookMethods](./webhook-methods.md)
- [Multi-Instance Operations](./multi-instance-operations.md)
 