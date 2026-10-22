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
    /**
     * Whether the model can be used. For a component model, `false` means it's disabled: nobody can
     * add, move or copy it into a zone, and the component picker doesn't list it. Components already
     * on a page still render and stay editable.
     *
     * On `saveModel`, leave it out (or `null`) to keep the stored value; a new model defaults to `true`.
     * Older API versions don't return it.
     */
    isVisible?: boolean | null;
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