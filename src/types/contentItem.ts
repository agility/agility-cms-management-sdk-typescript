export interface ContentItem {
    contentID: number;
    properties: ContentItemProperties;
    fields: { [key: string]: any; };
    seo: SeoProperties | null;
    scripts: ContentScripts | null;
}

export interface ContentItemProperties {
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

export interface SeoProperties {
    metaDescription: string | null;
    metaKeywords: string | null;
    metaHTML: string | null;
    menuVisible: boolean | null;
    sitemapVisible: boolean | null;
}

export interface ContentScripts {
    top: string | null;
    bottom: string | null;
}

export interface ContentList {
    recordOffset: number | null;
    totalCount: number | null;
    pageSize: number | null;
    items: any[] | null;
} 