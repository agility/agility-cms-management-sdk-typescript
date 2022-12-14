import { SeoProperties } from "./contentItem";

export class PageItem {
    pageID: number | null;
    name: string | null;
    path: string | null;
    title: string | null;
    menuText: string | null;
    pageType: string | null;
    templateName: string | null;
    redirectUrl: string | null;
    securePage: boolean | null;
    excludeFromOutputCache: boolean | null;
    visible: PageVisible | null;
    seo: SeoProperties | null;
    scripts: PageScripts | null;
    dynamic: PageDynamic | null;
    properties: PageItemProperties | null;
    zones: {[key: string]: PageModule[]} | null;
    parentPageID: number | null;
    placeBeforePageItemID: number | null;
    channelID: number | null;
    releaseDate: string | null;
    pullDate: string | null;
}

export class PageVisible {
    menu: boolean | null;
    sitemap: boolean | null;
}

export class PageScripts {
    excludedFromGlobal: boolean;
    top: string | null;
    bottom: string | null;
}

export class PageDynamic {
    referenceName: string | null;
    fieldName: string | null;
    titleFormula: string | null;
    menuTextFormula: string | null;
    pageNameFormula: string | null;
    visibleOnMenu: boolean | null;
    visibleOnSitemap: boolean | null;
}

export class PageItemProperties {
    state: number | null;
    modified: string | null;
    versionID: number | null;
}

export class PageModule {
    module: string | null;
    item: any | null;
}

export interface Dictionary<T> {
    [Key: string]: T;
}