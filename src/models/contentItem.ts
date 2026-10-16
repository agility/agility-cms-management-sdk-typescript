import { GeoProperties } from "./geo";

export class ContentItem {
    contentID: number;
    properties: ContentItemProperties;
    fields: { [key: string]: any; };
    seo: SeoProperties | null;
    /**
     * GEO / AEO properties of the page this item generates. Only items in a list that backs a
     * dynamic page carry them. On save, three states:
     * - left out (`undefined`): everything stored is kept;
     * - `null`: the whole block is cleared;
     * - an object: each property in it is applied (a property set to `null` clears just that
     *   property, one left out is kept; see `GeoProperties`).
     *
     * Absent from responses when the item has no GEO data.
     */
    geo?: GeoProperties | null;
    scripts: ContentScripts | null;
}

export class ContentItemProperties {
    state: number | null;
    modifiedBy: number | null;
    modified: string | null;
    pullDate: string | null;
    releaseDate: string | null;
    versionID: number | null;
    referenceName: string | null;
    definitionName: string | null;
    itemOrder: number | null;
}

export class SeoProperties {
    metaDescription: string | null;
    metaKeywords: string | null;
    metaHTML: string | null;
    menuVisible: boolean | null;
    sitemapVisible: boolean | null;

    // Pages and dynamic page list items only: title, canonicalUrl, robots and ogImage. On save each is three-state: left out
    // (`undefined`) keeps the stored value, `null` clears it, and a value replaces it.
    // Responses leave them out when they're not set.

    /** The page's `<title>`, when it differs from the page title. */
    title?: string | null;
    /** The page's canonical URL override. */
    canonicalUrl?: string | null;
    /** The page's robots directives. */
    robots?: SeoRobots | null;
    /** The URL of the page's social share (Open Graph) image. */
    ogImage?: string | null;
}

export class SeoRobots {
    /** Whether search engines may index the page. */
    index?: boolean | null;
    /** Whether search engines may follow the page's links. */
    follow?: boolean | null;
}

export class ContentScripts {
    top: string | null;
    bottom: string | null;
}

export class ContentList{
    recordOffset: number | null;
    totalCount: number | null;
    pageSize: number | null;
    items: any[] | null;
}