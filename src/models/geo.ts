/**
 * GEO / AEO (generative and answer engine optimization) properties of a page, or of a content item
 * in a list that backs a dynamic page (`ContentItem.geo`, the item's own values).
 *
 * Writes are three-state, per property:
 * - property left out (`undefined`), or the whole `geo` left out: the stored value is kept;
 * - property set to `null`: the stored value is cleared;
 * - property set to a value: the stored value is replaced.
 *
 * To clear the whole block, save the page with `geo: null`.
 *
 * `JSON.stringify` drops `undefined`, so a page read with `getPage` (or an item read with
 * `getContentItem`), changed elsewhere and saved keeps its GEO data. Only set a property to `null`
 * when you mean to clear it.
 * Responses leave out properties that aren't set.
 */
export class GeoProperties {
    /** The schema.org page type. Defaults to `WebPage` when not set. */
    schemaType?: GeoSchemaType | null;
    /** A short, answer-first plain-text summary of the page. */
    summary?: string | null;
    /** Editor-supplied JSON-LD (an object, which may hold an `@graph`, or an array of objects). Must be valid JSON. */
    structuredData?: { [key: string]: any } | { [key: string]: any }[] | null;
    /** The page's AI-engine settings. */
    ai?: GeoAiProperties | null;
}

/** The schema.org page types a page can declare. */
export type GeoSchemaType =
    | "WebPage"
    | "AboutPage"
    | "ContactPage"
    | "CollectionPage"
    | "FAQPage"
    | "ItemPage"
    | "ProfilePage";

export class GeoAiProperties {
    /** Whether the page is listed in llms.txt: `inherit` (follow sitemap visibility), `include` or `exclude`. */
    llmsInclude?: "inherit" | "include" | "exclude" | null;
    /** Whether AI crawlers may crawl the page: `inherit` (follow the site policy) or `block`. */
    crawl?: "inherit" | "block" | null;
}
