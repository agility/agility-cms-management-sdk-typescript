# Agility CMS & Management API TypeScript SDK

## UrlRedirectionMethods

This class manages an instance's URL redirections.

**Important Notes:**
- A request handles at most 250 redirections (`MAX_URL_REDIRECTIONS_PER_REQUEST`); split larger sets into several calls
- Deleting needs the Edit, Delete or Manage instance permission

### Function List
- [deleteUrlRedirections](#deleteurlredirections) - Deletes URL redirections by ID

---

### deleteUrlRedirections

Deletes up to 250 URL redirections in one request. An ID that does not match an active redirection — already deleted, or never there — is returned in `notFound` instead of failing the request, so it is safe to delete something that may already be gone.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `guid` | `string` | Yes | Current website GUID |
| `urlRedirectionIDs` | `number[]` | Yes | IDs of the redirections to delete (1–250) |

**Returns:** `Promise<UrlRedirectionDeleteResult>`

| Property | Type | Description |
|----------|------|-------------|
| `deleted` | `number[]` | IDs of the redirections that were deleted |
| `notFound` | `number[]` | IDs that did not match an active redirection |

**Throws:** `Exception` before any request when the list is empty or longer than 250, and when the API rejects the request (with `statusCode` and the server's message, e.g. 400 for an invalid ID).

**Usage Example:**
```typescript
import * as mgmtApi from '@agility/management-sdk';

const result = await apiClient.urlRedirectionMethods.deleteUrlRedirections(guid, [12, 13, 14]);

console.log(`Deleted: ${result.deleted.join(', ')}`);
if (result.notFound.length > 0) {
    console.log(`Already gone: ${result.notFound.join(', ')}`);
}
```

Deleting more than 250:
```typescript
for (let i = 0; i < ids.length; i += mgmtApi.MAX_URL_REDIRECTIONS_PER_REQUEST) {
    await apiClient.urlRedirectionMethods.deleteUrlRedirections(
        guid,
        ids.slice(i, i + mgmtApi.MAX_URL_REDIRECTIONS_PER_REQUEST)
    );
}
```
