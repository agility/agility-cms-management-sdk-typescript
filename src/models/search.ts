/**
 * A search across everything in an instance: content items, components, pages, assets, models and
 * containers. Only `query` is required.
 *
 * Results are limited to what the caller may see: content, pages and containers for everyone,
 * components and models with Develop or Manage, assets with Edit or Delete. Content and pages in
 * containers or pages the caller can't read are left out.
 */
export class SearchRequest {
    /**
     * The text to search for. Words match as prefixes ("newsl" finds "newsletter") and every word must
     * match; text in double quotes matches as an exact phrase. A number also matches content, page,
     * asset and model IDs exactly. A blank query is rejected (HTTP 400).
     */
    query!: string;
    /**
     * The kinds of result to return. Defaults to every kind the caller may see. An unknown kind is
     * rejected (HTTP 400). The facet counts always cover every kind the caller may see, whatever this is.
     */
    kinds?: SearchKind[] | null;
    /** Only search content, components and pages in this locale (for example `en-us`). Omit it, or pass `*`, for every locale. */
    locale?: string | null;
    /** Only return content in these containers, by reference name. Limits the search to content kinds. */
    containers?: string[] | null;
    /** Only return content and components of these models, by reference name. Limits the search to content kinds. */
    models?: string[] | null;
    /** Only return content in this state. An unknown state is rejected (HTTP 400). Limits the search to content kinds. */
    state?: SearchState | null;
    /** Only return results modified on or after this date (an ISO 8601 string, or a `Date`). */
    modifiedAfter?: string | Date | null;
    /** Results to skip, for paging. Defaults to 0. */
    skip?: number | null;
    /** Results to return. Defaults to 25; the API clamps it to 1..100. */
    take?: number | null;
}

/** A kind of search result. */
export type SearchKind =
    | "content"
    | "component"
    | "page"
    | "asset"
    | "model"
    | "container"
    // Any other string: tolerates kinds the API adds later.
    | (string & {});

/** A content state to filter on. `any` is the same as leaving it out. */
export type SearchState = "staging" | "published" | "unpublished" | "any";

/** The result of a search. */
export class SearchResult {
    /** The query as it was searched. */
    query: string | null;
    /** True when nothing matched every word, so the results match ANY of the words instead. */
    relaxed: boolean;
    /**
     * How many results there are of each kind the caller may see, keyed by kind, whichever kinds were
     * requested. So it can drive tabs.
     */
    facets: { [kind: string]: SearchFacet } | null;
    /** How many results there are across the requested kinds. */
    total: number;
    /** The requested page of results, best match first. */
    hits: SearchHit[] | null;
    /** How far behind the search index is. */
    indexing?: SearchIndexing | null;
}

/** The number of results of one kind. */
export class SearchFacet {
    count: number;
    /** True when there are more results than were counted; show the count as a minimum ("N+"). */
    capped: boolean;
}

/** How far behind the search index is. */
export class SearchIndexing {
    /** Changes not yet searchable. Usually 0; high after a big import. */
    pending: number;
    /** True while the instance is being indexed in the background: search again shortly. */
    catchingUp: boolean;
}

/** One search result. Properties that don't apply to the result's kind are null or left out. */
export class SearchHit {
    kind: SearchKind | null;
    /** Content Item, List Item, Component, Page, Asset, Content Model, Component Model, Content List or Single Item. */
    typeLabel?: string | null;
    /** The result's display name. */
    name?: string | null;
    /** Where the result lives: its container, page path, folder or model reference name. */
    context?: string | null;
    /** The matching text, HTML-encoded, with each matched word wrapped in `<mark>`. */
    snippet?: string | null;
    /** Which fields matched: field names, or `_title`, `_id`, `_attachment`, `_file`, `_model`, `_container`. */
    matchedFields?: string[] | null;
    /** The relevance score the results are ordered by. Higher is better. */
    score: number;
    /** The locale of a content, component or page result. Null for assets and models. */
    languageCode?: string | null;
    /** The state of a content, component or page result (Staging, Published, ...). */
    state?: string | null;
    modifiedDate?: string | null;
    modifiedBy?: string | null;
    /** A path to open the result in the Content Manager, relative to the instance (for example `content/list-12/listitem-34`). */
    viewLink?: string | null;
    /** The content ID of a content item, component or page's content. */
    contentID?: number | null;
    /** The ID of the container a content item or component lives in. */
    containerID?: number | null;
    containerReferenceName?: string | null;
    /** The page ID of a page, or of a page a component sits on. */
    pageID?: number | null;
    pagePath?: string | null;
    channel?: string | null;
    mediaID?: number | null;
    /** The asset's URL. */
    url?: string | null;
    /** The asset's MIME type. */
    contentType?: string | null;
    /** The asset's size in bytes. */
    size?: number | null;
    modelID?: number | null;
    modelReferenceName?: string | null;
}
