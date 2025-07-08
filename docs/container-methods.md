# Agility CMS & Management API TypeScript SDK

## ContainerMethods

This class provides comprehensive container management operations for organizing and managing content within Agility CMS. Containers are used to group related content items and control access permissions.

**Important Notes:**
- Containers organize content items by their definition types
- Each container has security settings that control user access
- Containers can have notification settings for workflow events
- Reference names must be unique within the instance
- Containers cannot be deleted if they contain content items

### Function List
- [getContainerByID](#getcontainerbyid) - Retrieves a specific container by ID
- [getContainersByModel](#getcontainersbymodel) - Retrieves containers associated with a content model
- [getContainerByReferenceName](#getcontainerbyreferencename) - Retrieves a container by reference name
- [getContainerSecurity](#getcontainersecurity) - Retrieves security settings for a container
- [getContainerList](#getcontainerlist) - Retrieves list of all containers
- [getNotificationList](#getnotificationlist) - Retrieves notification settings for a container
- [saveContainer](#savecontainer) - Creates or updates a container
- [deleteContainer](#deletecontainer) - Deletes a container by ID

---

### getContainerByID

Retrieves a specific container by its unique ID.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | `number` | Yes | The container ID to retrieve |
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `Container` - Container object with complete configuration

**Usage Example:**
```typescript
const container = await apiClient.containerMethods.getContainerByID(123, guid);
console.log('Container name:', container.displayName);
console.log('Reference name:', container.referenceName);
console.log('Model ID:', container.modelId);
```

**Error Handling:**
- Throws `Exception` when container not found

### getContainersByModel

Retrieves all containers associated with a specific content model.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `modelId` | `number` | Yes | The content model ID |
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `Container[]` - Array of containers using the specified model

**Usage Example:**
```typescript
const containers = await apiClient.containerMethods.getContainersByModel(456, guid);
console.log(`Found ${containers.length} containers for this model`);

// Process each container
containers.forEach(container => {
    console.log(`Container: ${container.displayName} (${container.referenceName})`);
});
```

**Error Handling:**
- Throws `Exception` when model not found or retrieval fails

### getContainerByReferenceName

Retrieves a container by its reference name. Returns null if the container doesn't exist.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `referenceName` | `string` | Yes | The reference name of the container |
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `Container | null` - Container object or null if not found

**Usage Example:**
```typescript
const container = await apiClient.containerMethods.getContainerByReferenceName('blog-posts', guid);
if (container) {
    console.log('Container found:', container.displayName);
    console.log('Container ID:', container.id);
} else {
    console.log('Container not found');
}
```

**Error Handling:**
- Returns `null` for 404 errors (container not found)
- Throws `Exception` for other errors

### getContainerSecurity

Retrieves the security settings for a specific container.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | `number` | Yes | The container ID |
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `Container` - Container object with security information

**Usage Example:**
```typescript
const security = await apiClient.containerMethods.getContainerSecurity(123, guid);
console.log('Security settings:', security.securitySettings);

// Check if container has specific permissions
if (security.securitySettings) {
    console.log('Container has custom security settings');
} else {
    console.log('Container uses default security settings');
}
```

**Error Handling:**
- Throws `Exception` when container not found or access denied

### getContainerList

Retrieves a list of all containers in the current website.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `Container[]` - Array of all containers

**Usage Example:**
```typescript
const containers = await apiClient.containerMethods.getContainerList(guid);
console.log(`Total containers: ${containers.length}`);

// Filter by content type
const blogContainers = containers.filter(c => c.referenceName.includes('blog'));
console.log(`Blog-related containers: ${blogContainers.length}`);

// Group by model
const containersByModel = containers.reduce((acc, container) => {
    const modelId = container.modelId;
    if (!acc[modelId]) acc[modelId] = [];
    acc[modelId].push(container);
    return acc;
}, {});
```

**Error Handling:**
- Throws `Exception` when retrieval fails

### getNotificationList

Retrieves the notification settings for a specific container.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | `number` | Yes | The container ID |
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `Notification[]` - Array of notification configurations

**Usage Example:**
```typescript
const notifications = await apiClient.containerMethods.getNotificationList(123, guid);
console.log(`Container has ${notifications.length} notification rules`);

notifications.forEach(notification => {
    console.log(`Notification: ${notification.name}`);
    console.log(`Type: ${notification.type}`);
    console.log(`Recipients: ${notification.recipients}`);
});
```

**Error Handling:**
- Throws `Exception` when container not found or access denied

### saveContainer

Creates a new container or updates an existing one.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `container` | `Container` | Yes | Container object to save |
| `guid` | `string` | Yes | Current website GUID |
| `forceReferenceName` | `boolean` | No | Force reference name validation *(Optional, default: false)* |

**Returns:** `Container` - Saved container object with updated metadata

**Usage Example:**
```typescript
// Create a new container
const newContainer = {
    referenceName: 'product-reviews',
    displayName: 'Product Reviews',
    modelId: 789,
    isPublicListing: true,
    description: 'Container for product review content items'
};

const savedContainer = await apiClient.containerMethods.saveContainer(
    newContainer, 
    guid, 
    true
);
console.log('Container saved with ID:', savedContainer.id);

// Update existing container
const existingContainer = await apiClient.containerMethods.getContainerByID(123, guid);
existingContainer.displayName = 'Updated Display Name';
const updatedContainer = await apiClient.containerMethods.saveContainer(existingContainer, guid);
```

**Error Handling:**
- Throws `Exception` when validation fails or save operation fails

### deleteContainer

Deletes a container by its ID.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | `number` | Yes | The container ID to delete |
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `string` - Confirmation message of successful deletion

**Usage Example:**
```typescript
try {
    const result = await apiClient.containerMethods.deleteContainer(123, guid);
    console.log(result); // "Container deleted successfully"
} catch (error) {
    if (error.message.includes('contains content')) {
        console.log('Cannot delete container: still contains content items');
        // Handle by moving or deleting content first
    } else {
        console.error('Failed to delete container:', error.message);
    }
}
```

**Error Handling:**
- Throws `Exception` when container not found, has content, or deletion fails

**Note:** Containers cannot be deleted if they contain content items. Remove all content first.

---

## Navigation
- [← Back to Main Documentation](../README.md)
- [AssetMethods](./asset-methods.md)
- [BatchMethods](./batch-methods.md)
- **ContainerMethods** *(current)*
- [ContentMethods](./content-methods.md)
- [InstanceMethods](./instance-methods.md)
- [InstanceUserMethods](./instance-user-methods.md)
- [ModelMethods](./model-methods.md)
- [PageMethods](./page-methods.md)
- [ServerUserMethods](./server-user-methods.md)
- [WebhookMethods](./webhook-methods.md) 