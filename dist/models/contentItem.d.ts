export declare class ContentItem {
    contentID: number;
    properties: ContentItemProperties;
    fields: {
        [key: string]: any;
    };
    seo: SeoProperties | null;
    scripts: ContentScripts | null;
}
export declare class ContentItemProperties {
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
export declare class SeoProperties {
    metaDescription: string | null;
    metaKeywords: string | null;
    metaHTML: string | null;
    menuVisible: boolean | null;
    sitemapVisible: boolean | null;
}
export declare class ContentScripts {
    top: string | null;
    bottom: string | null;
}
