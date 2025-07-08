# Agility CMS & Management API TypeScript SDK

## ServerUserMethods

This class provides server-level user management operations for Agility CMS. These methods handle user accounts at the server level, which is different from instance-level users and provides broader administrative capabilities.

**Important Notes:**
- Server user methods typically require server-level administrative privileges
- These operations affect user accounts across multiple instances
- Server users have elevated permissions compared to instance users
- Server user management is typically used for system administration
- Changes to server users may affect access to multiple instances

### Function List
- [me](#me) - Retrieves current server user information
- [you](#you) - Retrieves specific server user information

---

### me

Retrieves current authenticated server user information.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `ServerUser` - Complete server user object with roles and permissions

**Usage Example:**
```typescript
const serverUser = await apiClient.serverUserMethods.me(guid);
console.log(`Server User: ${serverUser.firstName} ${serverUser.lastName}`);
console.log(`Email: ${serverUser.emailAddress}`);
console.log(`Role: ${serverUser.roleName}`);
console.log(`Status: ${serverUser.isActive ? 'Active' : 'Inactive'}`);
console.log(`Last Login: ${serverUser.lastLoginDate}`);
console.log(`Created: ${serverUser.createdDate}`);

// Check server-level permissions
if (serverUser.permissions && serverUser.permissions.length > 0) {
    console.log('Server permissions:');
    serverUser.permissions.forEach(permission => {
        console.log(`  - ${permission}`);
    });
} else {
    console.log('User has no specific server permissions assigned');
}

// Check if user is a server administrator
const isServerAdmin = serverUser.roleName === 'Server Administrator' || 
                     serverUser.roleName === 'System Administrator';
console.log(`Is Server Administrator: ${isServerAdmin}`);

// Display instance access
if (serverUser.instanceAccess && serverUser.instanceAccess.length > 0) {
    console.log('Instance access:');
    serverUser.instanceAccess.forEach(access => {
        console.log(`  - Instance: ${access.instanceName} (${access.role})`);
    });
} else {
    console.log('User has no instance access assigned');
}
```

**Response Properties:**
The `ServerUser` object includes:
- `userID`: Unique identifier for the server user
- `firstName`: User's first name
- `lastName`: User's last name
- `emailAddress`: User's email address
- `roleName`: The user's server-level role
- `isActive`: Whether the user account is active
- `lastLoginDate`: Date of the user's last login
- `createdDate`: Date the user account was created
- `permissions`: Array of server-level permissions
- `instanceAccess`: Array of instance access configurations

**Server User Roles:**
Common server-level roles include:
- `Server Administrator`: Full server-level access
- `System Administrator`: Complete system control
- `Instance Manager`: Can manage multiple instances
- `Support User`: Limited access for support purposes

**Error Handling:**
- Throws `Exception` when server user not found
- Throws `Exception` when insufficient permissions to view server user details

### you

Retrieves specific server user information by server user ID.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `guid` | `string` | Yes | Current website GUID |
| `serverUserID` | `number` | Yes | The server user ID to retrieve |

**Returns:** `any` - Server user information and data

**Usage Example:**
```typescript
// Create a new server user
const newServerUser = {
    firstName: 'John',
    lastName: 'Admin',
    emailAddress: 'john.admin@company.com',
    roleName: 'Server Administrator',
    isActive: true,
    password: 'SecureServerPassword123!', // Only required for new users
    permissions: [
        'server.read',
        'server.write',
        'instance.create',
        'instance.manage'
    ],
    instanceAccess: [
        {
            instanceGUID: 'instance-guid-1',
            instanceName: 'Production Instance',
            role: 'Administrator'
        },
        {
            instanceGUID: 'instance-guid-2',
            instanceName: 'Staging Instance',
            role: 'Editor'
        }
    ]
};

const savedServerUser = await apiClient.serverUserMethods.saveServerUser(
    newServerUser, 
    guid
);
console.log('Server user created with ID:', savedServerUser.userID);

// Update existing server user
const existingServerUser = await apiClient.serverUserMethods.getServerUser(123, guid);
existingServerUser.firstName = 'Jane';
existingServerUser.roleName = 'Instance Manager';
existingServerUser.isActive = true;

// Add new instance access
existingServerUser.instanceAccess.push({
    instanceGUID: 'new-instance-guid',
    instanceName: 'New Instance',
    role: 'Publisher'
});

const updatedServerUser = await apiClient.serverUserMethods.saveServerUser(
    existingServerUser, 
    guid
);
console.log('Server user updated:', updatedServerUser.emailAddress);

// Grant server-level permissions
const grantServerPermissions = async (userID, permissions) => {
    const user = await apiClient.serverUserMethods.getServerUser(userID, guid);
    user.permissions = [...new Set([...user.permissions, ...permissions])];
    return await apiClient.serverUserMethods.saveServerUser(user, guid);
};

// Promote user to server administrator
const promoteToServerAdmin = async (userID) => {
    const user = await apiClient.serverUserMethods.getServerUser(userID, guid);
    user.roleName = 'Server Administrator';
    user.permissions = [
        'server.read',
        'server.write',
        'instance.create',
        'instance.manage',
        'user.manage'
    ];
    return await apiClient.serverUserMethods.saveServerUser(user, guid);
};

// Manage instance access
const updateInstanceAccess = async (userID, instanceGUID, role) => {
    const user = await apiClient.serverUserMethods.getServerUser(userID, guid);
    
    // Find existing access or create new
    const existingAccess = user.instanceAccess.find(
        access => access.instanceGUID === instanceGUID
    );
    
    if (existingAccess) {
        existingAccess.role = role;
    } else {
        user.instanceAccess.push({
            instanceGUID: instanceGUID,
            instanceName: 'Instance Name', // You'd get this from instance details
            role: role
        });
    }
    
    return await apiClient.serverUserMethods.saveServerUser(user, guid);
};
```

**Server User Structure:**
```typescript
interface ServerUser {
    userID?: number;              // Auto-generated for new users
    firstName: string;            // User's first name (required)
    lastName: string;             // User's last name (required)
    emailAddress: string;         // User's email address (required, unique)
    roleName: string;             // Server-level role (required)
    isActive: boolean;            // Whether the account is active
    password?: string;            // Required for new users only
    permissions: string[];        // Array of server-level permissions
    instanceAccess: InstanceAccess[]; // Array of instance access configurations
    lastLoginDate?: string;       // Auto-generated
    createdDate?: string;         // Auto-generated
}

interface InstanceAccess {
    instanceGUID: string;         // Instance identifier
    instanceName: string;         // Human-readable instance name
    role: string;                 // Role within that instance
}
```

**Server-Level Permissions:**
Common server permissions include:
- `server.read`: Read server configuration
- `server.write`: Modify server configuration
- `instance.create`: Create new instances
- `instance.manage`: Manage existing instances
- `user.manage`: Manage server users
- `system.admin`: Full system administration

**Instance Access Configuration:**
- Each server user can have access to multiple instances
- Access is granted with specific roles per instance
- Instance access can be managed independently of server-level permissions
- Common instance roles: Administrator, Editor, Publisher, Contributor

**Validation Rules:**
- `emailAddress` must be unique across all server users
- `password` is required for new users (not needed for updates)
- `firstName` and `lastName` are required
- `roleName` must be a valid server-level role
- `instanceAccess` entries must reference valid instances

**Error Handling:**
- Throws `Exception` when validation fails (duplicate email, invalid role, etc.)
- Throws `Exception` when save operation fails
- Throws `Exception` when insufficient permissions to create/update server users
- Throws `Exception` when instance access references invalid instances

**Security Considerations:**
- Server user operations require the highest level of permissions
- Changes to server users can affect multiple instances
- Always validate instance access before granting permissions
- Consider using role-based access control for server users
- Monitor server user activity for security compliance

**Best Practices:**
- Use principle of least privilege when assigning server permissions
- Regularly review and audit server user accounts
- Implement strong password policies for server users
- Deactivate unused server user accounts
- Log all server user management activities

---

## Navigation
- [← Back to Main Documentation](../README.md)
- [Authentication & Setup](./auth.md)
- [Multi-Instance Operations](./multi-instance-operations.md)
- [AssetMethods](./asset-methods.md)
- [BatchMethods](./batch-methods.md)
- [ContainerMethods](./container-methods.md)
- [ContentMethods](./content-methods.md)
- [InstanceMethods](./instance-methods.md)
- [InstanceUserMethods](./instance-user-methods.md)
- [ModelMethods](./model-methods.md)
- [PageMethods](./page-methods.md)
- **ServerUserMethods** *(current)*
- [WebhookMethods](./webhook-methods.md) 