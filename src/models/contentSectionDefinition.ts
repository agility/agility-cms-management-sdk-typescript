import { PageItemTemplateType } from "../enums/pageItemTemplateType";
import { ContentSectionDefaultModule } from "./contentSectionDefaultModule";
import { SharedModule } from "./sharedModule";

export class ContentSectionDefinition{
    defaultModules: ContentSectionDefaultModule[];
    sharedModules: SharedModule[];
    pageItemTemplateID: number | null;
    pageTemplateID: number | null;
    pageItemTemplateName: string | null;
    pageItemTemplateReferenceName: string | null;
    pageItemTemplateType: PageItemTemplateType;
    pageItemTemplateTypeName: string | null;
    itemOrder: number | null;
    moduleOrder: number | null;
    contentViewID: number | null;
    contentReferenceName: string | null;
    contentDefinitionID: number | null;
    contentViewName: string | null;
    itemContainerID: number | null;
    publishContentItemID: number | null;
    releaseDate: string;
    pullDate: string;
    isShared: boolean;
    isSharedTemplate: boolean;
    enablePersonalization: boolean;
    doesPageTemplateHavePages: boolean;
    moduleID: number | null;
    contentDefinitionTitle: string | null;
    userControlPath: string | null;
    templateMarkup: string | null;
    sortExpression: string | null;
    filterExpression: string | null;
    contentTemplateID: number | null;
    contentTemplateName: string | null;
}