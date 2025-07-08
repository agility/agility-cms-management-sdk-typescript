# InstanceMethods API Documentation

The `InstanceMethods` class provides instance-level operations for retrieving configuration and settings.

## Function List

| Function | Description |
|----------|-------------|
| [getLocales](#getlocales) | Retrieves all available locales for the instance |

---

## getLocales

Retrieves all available locales configured for the current Agility CMS instance.

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| guid | string | Yes | The website GUID |

### Returns

`Promise<Locales[]>` - Array of locale objects with language configuration

### Usage Example

```typescript
const locales = await client.instanceMethods.getLocales('your-guid');

// Display available locales
locales.forEach(locale => {
  console.log(`${locale.name} (${locale.code})`);
});

// Find default locale
const defaultLocale = locales.find(locale => locale.isDefault);
console.log('Default locale:', defaultLocale.code);

// Get all enabled locales
const enabledLocales = locales.filter(locale => locale.isEnabled);
console.log(`${enabledLocales.length} locales are enabled`);
```

### Locale Object Structure

```typescript
interface Locales {
  code: string;           // Language code (e.g., 'en-us', 'fr-ca')
  name: string;           // Display name (e.g., 'English (United States)')
  isDefault: boolean;     // Whether this is the default locale
  isEnabled: boolean;     // Whether this locale is enabled
  // Additional locale properties may be available
}
```

### Common Use Cases

```typescript
// Get locale codes for content operations
const locales = await client.instanceMethods.getLocales(guid);
const localeCodes = locales.map(locale => locale.code);

// Use with content operations
for (const localeCode of localeCodes) {
  const content = await client.contentMethods.getContentItem(123, guid, localeCode);
  console.log(`Content in ${localeCode}:`, content.fields.title);
}

// Check if a specific locale is available
const hasSpanish = locales.some(locale => locale.code === 'es-es');
if (hasSpanish) {
  console.log('Spanish locale is available');
}
```

---

## Error Handling

The method throws `Exception` objects on failure:

```typescript
try {
  const locales = await client.instanceMethods.getLocales('your-guid');
} catch (error) {
  console.error('Failed to retrieve locales:', error.message);
}
```

---

## Navigation
- [← Back to Main Documentation](../README.md)
- [Authentication & Setup](./auth.md)
- [AssetMethods](./asset-methods.md)
- [BatchMethods](./batch-methods.md)
- [ContainerMethods](./container-methods.md)
- [ContentMethods](./content-methods.md)
- [InstanceUserMethods](./instance-user-methods.md)
- [ModelMethods](./model-methods.md)
- [PageMethods](./page-methods.md)
- [ServerUserMethods](./server-user-methods.md)
- [WebhookMethods](./webhook-methods.md) 