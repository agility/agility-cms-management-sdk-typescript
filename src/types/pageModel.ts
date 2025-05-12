import { ContentSectionDefinition } from "./contentSectionDefinition";

export interface PageModel {
    doesPageTemplateHavePages: boolean;
    pageTemplateID: number | null;
    digitalChannelTypeID: number | null;
    digitalChannelTypeName: string | null;
    agilityCode: boolean;
    pageTemplateName: string | null;
    relativeURL: string | null;
    pageNames: string | null;
    isDeleted: boolean;
    previewUrl: string | null;
    contentSectionDefinitions: (ContentSectionDefinition | null)[] | null;
} 