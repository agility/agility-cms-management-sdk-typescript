export class Model {
    id: number | null;
    lastModifiedDate: string | null;
    displayName: string | null;
    referenceName: string | null;
    lastModifiedBy: string | null;
    fields: ModelField[];
    lastModifiedAuthorID: number | null;
    description: string | null;
    allowTagging: boolean | null;
    contentDefinitionTypeName: string | null;
    isPublished: boolean | null;
    wasUnpublished: boolean | null;
}

export class ModelField {
    name: string | null;
    label: string | null;
    type: string | null;
    settings: { [key: string]: string; };
    labelHelpDescription: string | null;
    itemOrder: number | null;
    designerOnly: boolean | null;
    isDataField: boolean | null;
    editable: boolean | null;
    hiddenField: boolean | null;
    fieldID: string | null;
    description: string | null;
}