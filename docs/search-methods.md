# Agility CMS & Management API TypeScript SDK

## SearchMethods

This class searches everything in an instance in one call: content items, components, pages, assets, models and containers. Results are ranked across kinds, best match first, and come with a count per kind so they can drive tabs.

**Important Notes:**
- Words match as prefixes (`newsl` finds `newsletter`) and every word must match; text in double quotes matches as an exact phrase. A number also matches content, page, asset and model IDs exactly
- If nothing matches every word, the results match **any** of the words instead and `relaxed` is `true`
- You only see what your permissions allow: content, pages and containers for everyone; components and models need Develop or Manage; assets need Edit or Delete; content and pages in containers or pages you can't read are left out. The API applies this, so there's nothing to filter on the client
- Changes are searchable a few seconds after they are saved
- Search is not yet available on every instance. When it isn't, `search` throws a [`SearchNotAvailableException`](#searchnotavailableexception)

### Function List
- [search](#search) - Searches an instance

### Reference
- [The SearchRequest object](#the-searchrequest-object)
- [The SearchResult object](#the-searchresult-object)
- [SearchNotAvailableException](#searchnotavailableexception)

---

### search

Searches an instance. Makes one request and never retries.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `guid` | `string` | Yes | Current website GUID |
| `request` | `SearchRequest` | Yes | What to search for, and optional filters and paging. Only `query` is required |

**Returns:** `Promise<SearchResult>`

**Usage Example:**
```typescript
import * as mgmtApi from '@agility/management-sdk';

const result = await apiClient.searchMethods.search(guid, { query: 'newsletter' });

console.log(`${result.total} results${result.relaxed ? ' (matching any word)' : ''}`);
for (const [kind, facet] of Object.entries(result.facets ?? {})) {
    console.log(`${kind}: ${facet.count}${facet.capped ? '+' : ''}`);
}
result.hits?.forEach(hit => {
    console.log(`[${hit.typeLabel}] ${hit.name} in ${hit.context} -> ${hit.viewLink}`);
});

// Only published content and pages in en-us, second page of 10
const page2 = await apiClient.searchMethods.search(guid, {
    query: '"spring sale"',
    kinds: ['content', 'page'],
    locale: 'en-us',
    state: 'published',
    skip: 10,
    take: 10
});
```

**Error Handling:**
- Throws `SearchNotAvailableException` (`statusCode` 501) when search is not available for the instance yet
- Throws `Exception` with `statusCode` 400 for a blank query, an unknown kind or an unknown state
- Throws `Exception` when the search fails for any other reason

---

### The SearchRequest object

| Property | Type | Description |
|----------|------|-------------|
| `query` | `string` | **Required.** The text to search for |
| `kinds` | `SearchKind[]` | Any of `content`, `component`, `page`, `asset`, `model`, `container`. Defaults to every kind you can see. The facet counts always cover every kind you can see, whatever this is |
| `locale` | `string` | Only search content, components and pages in this locale (for example `en-us`). Omit it, or pass `*`, for every locale |
| `containers` | `string[]` | Only return content in these containers, by reference name. Limits the search to content kinds |
| `models` | `string[]` | Only return content and components of these models, by reference name. Limits the search to content kinds |
| `state` | `SearchState` | `staging`, `published`, `unpublished` or `any`. Limits the search to content kinds |
| `modifiedAfter` | `string \| Date` | Only return results modified on or after this date |
| `skip` | `number` | Results to skip, for paging (default: 0) |
| `take` | `number` | Results to return (default: 25, at most 100) |

### The SearchResult object

| Property | Type | Description |
|----------|------|-------------|
| `query` | `string` | The query as it was searched |
| `relaxed` | `boolean` | `true` when nothing matched every word, so the results match any of the words |
| `facets` | `{ [kind: string]: SearchFacet }` | `{ count, capped }` for each kind you can see, whichever kinds you asked for. When `capped` is `true` there are more than `count`: show it as "N+" |
| `total` | `number` | How many results there are across the requested kinds |
| `hits` | `SearchHit[]` | The requested page of results, best match first |
| `indexing` | `SearchIndexing` | `{ pending, catchingUp }`: `pending` is the number of changes not yet searchable (usually 0, high after a big import); `catchingUp` is `true` while the instance is being indexed in the background, so search again shortly |

Each `SearchHit` has a `kind`, `typeLabel`, `name`, `context` (its container, page path, folder or model reference name), `snippet` (HTML-encoded, with matched words wrapped in `<mark>`), `matchedFields`, `score`, and a `viewLink` to open it in the Content Manager, relative to the instance. The IDs and details that apply to its kind are set too: `contentID`, `containerID`, `containerReferenceName`, `pageID`, `pagePath`, `channel`, `languageCode`, `state`, `modifiedDate`, `modifiedBy`, `mediaID`, `url`, `contentType`, `size`, `modelID` and `modelReferenceName`. The rest are `null` or left out.

### SearchNotAvailableException

Thrown when the API answers 501: search is not available for this instance yet. It isn't a transient failure, so don't retry it.

```typescript
import { SearchNotAvailableException } from '@agility/management-sdk';

try {
    const result = await apiClient.searchMethods.search(guid, { query: 'newsletter' });
} catch (err) {
    if (err instanceof SearchNotAvailableException) {
        // Fall back to listing or filtering content instead.
    } else {
        throw err;
    }
}
```

When more than one copy of the SDK may be loaded, check `err.name === 'SearchNotAvailableException'` instead. `err.statusCode` is `501`.

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
- [PageMethods](./page-methods.md)
- **SearchMethods** *(current)*
- [ServerUserMethods](./server-user-methods.md)
- [WebhookMethods](./webhook-methods.md)
