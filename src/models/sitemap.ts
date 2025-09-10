export class Sitemap {
	digitalChannelID!: number | null;
	name!: string | null;
	digitalChannelTypeName!: string | null;
	isDefaultChannel!: boolean;
	pages!: (SitemapItem | null)[];
}

export class SitemapItem {
	pageID!: number | null;
	parentPageID!: number | null;
	pageName!: string | null;
	title!: string | null;
	pageType!: string | null;
	languageCode!: string | null;
	pageMode!: number | null;
	dynamicPageContentReferenceName!: string | null;
	dynamicPageContentViewFieldName!: string | null;
	uRL!: string | null;
	childPages!: (SitemapItem | null)[];
}
