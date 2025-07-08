# Agility CMS & Management API TypeScript SDK

## InstanceUserMethods

This class provides comprehensive user management operations for Agility CMS instances. These methods allow you to manage user accounts, roles, and permissions within your instance.

**Important Notes:**
- Instance user methods typically require administrative privileges
- These operations affect user accounts across the entire instance
- Role assignments control user access to different areas of the CMS
- User management changes may affect website permissions and access

### Function List
- [getInstanceUser](#getinstanceuser) - Retrieves a specific instance user by ID
- [saveInstanceUser](#saveinstanceuser) - Creates or updates an instance user
- [deleteInstanceUser](#deleteinstanceuser) - Deletes an instance user by ID

---

### getInstanceUser

Retrieves a specific instance user by their unique ID.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userID` | `number` | Yes | The user ID to retrieve |
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `InstanceUser` - Complete user object with roles and permissions

**Usage Example:**
```typescript
const user = await apiClient.instanceUserMethods.getInstanceUser(123, guid);
console.log(`User: ${user.firstName} ${user.lastName}`);
console.log(`Email: ${user.emailAddress}`);
console.log(`Role: ${user.roleName}`);
console.log(`Status: ${user.isActive ? 'Active' : 'Inactive'}`);
console.log(`Last Login: ${user.lastLoginDate}`);

// Check user permissions
if (user.permissions && user.permissions.length > 0) {
    console.log('User permissions:');
    user.permissions.forEach(permission => {
        console.log(`  - ${permission}`);
    });
} else {
    console.log('User has no specific permissions assigned');
}

// Check if user is an administrator
const isAdmin = user.roleName === 'Administrator' || 
               user.roleName === 'Instance Administrator';
console.log(`Is Administrator: ${isAdmin}`);
```

**Response Properties:**
The `InstanceUser` object includes:
- `userID`: Unique identifier for the user
- `firstName`: User's first name
- `lastName`: User's last name
- `emailAddress`: User's email address
- `roleName`: The user's role within the instance
- `isActive`: Whether the user account is active
- `lastLoginDate`: Date of the user's last login
- `createdDate`: Date the user account was created
- `permissions`: Array of specific permissions assigned to the user

**Error Handling:**
- Throws `Exception` when user not found
- Throws `Exception` when insufficient permissions to view user details

### saveInstanceUser

Creates a new instance user or updates an existing one.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `user` | `InstanceUser` | Yes | User object to save |
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `InstanceUser` - Saved user object with updated metadata

**Usage Example:**
```typescript
// Create a new user
const newUser = {
    firstName: 'John',
    lastName: 'Doe',
    emailAddress: 'john.doe@company.com',
    roleName: 'Editor',
    isActive: true,
    password: 'SecurePassword123!', // Only required for new users
    permissions: ['content.read', 'content.write']
};

const savedUser = await apiClient.instanceUserMethods.saveInstanceUser(newUser, guid);
console.log('User created with ID:', savedUser.userID);

// Update existing user
const existingUser = await apiClient.instanceUserMethods.getInstanceUser(123, guid);
existingUser.firstName = 'Jane';
existingUser.roleName = 'Administrator';
existingUser.isActive = false; // Deactivate user

const updatedUser = await apiClient.instanceUserMethods.saveInstanceUser(existingUser, guid);
console.log('User updated:', updatedUser.emailAddress);

// Bulk user role update
const updateUserRole = async (userID, newRole) => {
    const user = await apiClient.instanceUserMethods.getInstanceUser(userID, guid);
    user.roleName = newRole;
    return await apiClient.instanceUserMethods.saveInstanceUser(user, guid);
};

// Promote user to administrator
await updateUserRole(123, 'Administrator');
```

**User Roles:**
Common role names include:
- `Administrator`: Full access to all instance features
- `Instance Administrator`: Instance-level administrative access
- `Editor`: Content creation and editing permissions
- `Publisher`: Content publishing permissions
- `Contributor`: Limited content creation permissions
- `Viewer`: Read-only access

**Validation Rules:**
- `emailAddress` must be unique within the instance
- `password` is required for new users (not needed for updates)
- `firstName` and `lastName` are required
- `roleName` must be a valid role within the instance

**Error Handling:**
- Throws `Exception` when validation fails (duplicate email, invalid role, etc.)
- Throws `Exception` when save operation fails
- Throws `Exception` when insufficient permissions to create/update users

### deleteInstanceUser

Deletes an instance user by their unique ID.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userID` | `number` | Yes | The user ID to delete |
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `string` - Confirmation message of successful deletion

**Usage Example:**
```typescript
try {
    const result = await apiClient.instanceUserMethods.deleteInstanceUser(123, guid);
    console.log(result); // "User deleted successfully"
} catch (error) {
    if (error.message.includes('owns content')) {
        console.log('Cannot delete user: user owns content items');
        // Handle by reassigning content or archiving user instead
    } else if (error.message.includes('last administrator')) {
        console.log('Cannot delete user: last administrator in instance');
    } else {
        console.error('Failed to delete user:', error.message);
    }
}

// Safe user deletion with checks
const safeDeleteUser = async (userID) => {
    try {
        // Get user details first
        const user = await apiClient.instanceUserMethods.getInstanceUser(userID, guid);
        console.log(`Attempting to delete user: ${user.emailAddress}`);
        
        // Check if user is active
        if (user.isActive) {
            console.log('Warning: Deleting active user');
        }
        
        // Perform deletion
        const result = await apiClient.instanceUserMethods.deleteInstanceUser(userID, guid);
        console.log('User deleted successfully');
        return result;
    } catch (error) {
        console.error('Failed to delete user:', error.message);
        throw error;
    }
};

// Alternative: Deactivate instead of delete
const deactivateUser = async (userID) => {
    const user = await apiClient.instanceUserMethods.getInstanceUser(userID, guid);
    user.isActive = false;
    return await apiClient.instanceUserMethods.saveInstanceUser(user, guid);
};
```

**Deletion Restrictions:**
- Cannot delete a user who owns content items (reassign content first)
- Cannot delete the last administrator in the instance
- Cannot delete your own user account
- Cannot delete users with active sessions (in some cases)

**Best Practices:**
- Consider deactivating users instead of deleting them to preserve audit trails
- Reassign content ownership before deleting users
- Ensure at least one administrator remains in the instance
- Log user deletions for security auditing

**Error Handling:**
- Throws `Exception` when user not found
- Throws `Exception` when user cannot be deleted (owns content, last admin, etc.)
- Throws `Exception` when insufficient permissions to delete users

---

## Navigation
- [← Back to Main Documentation](../README.md)
- [AssetMethods](./asset-methods.md)
- [BatchMethods](./batch-methods.md)
- [ContainerMethods](./container-methods.md)
- [ContentMethods](./content-methods.md)
- [InstanceMethods](./instance-methods.md)
- **InstanceUserMethods** *(current)*
- [ModelMethods](./model-methods.md)
- [PageMethods](./page-methods.md)
- [ServerUserMethods](./server-user-methods.md)
- [WebhookMethods](./webhook-methods.md) 