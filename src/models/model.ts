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
     * add or copy it into a zone, and the component picker doesn't list it. Components already on a
     * page still render, stay editable and can still be moved to another zone or page model.
     *
     * On `saveModel`, it's read only when the save creates the model (left out or `null`, a new model
     * is visible). On an update the stored value is always kept, so a sync from another instance can't
     * re-enable a disabled model. To disable or re-enable an existing model, use the Manager App (the
     * Management API's `model/{id}/visibility` route isn't in this SDK yet). Older API versions don't return it.
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