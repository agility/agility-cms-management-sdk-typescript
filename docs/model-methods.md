# Agility CMS & Management API TypeScript SDK

## ModelMethods

This class provides comprehensive content model management operations for Agility CMS. Content models define the structure and fields for content items, acting as templates that determine what data can be stored and how it's organized.

**Important Notes:**
- Content models define the schema for content items
- Models contain field definitions that specify data types, validation rules, and UI controls
- Changes to models may affect existing content items using those models
- Models are used by containers to organize and validate content
- Model reference names must be unique within the instance

### Function List
- [getModel](#getmodel) - Retrieves a specific content model by ID
- [getModelByReferenceName](#getmodelbyreferencename) - Retrieves a model by reference name
- [getModelList](#getmodellist) - Retrieves list of all content models
- [getModelFields](#getmodelfields) - Retrieves field definitions for a model
- [saveModel](#savemodel) - Creates or updates a content model
- [deleteModel](#deletemodel) - Deletes a content model by ID

---

### getModel

Retrieves a specific content model by its unique ID.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `modelID` | `number` | Yes | The model ID to retrieve |
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `Model` - Complete model object with field definitions

**Usage Example:**
```typescript
const model = await apiClient.modelMethods.getModel(123, guid);
console.log('Model name:', model.displayName);
console.log('Reference name:', model.referenceName);
console.log('Description:', model.description);
console.log('Field count:', model.fields.length);

// Display field information
model.fields.forEach(field => {
    console.log(`Field: ${field.name} (${field.type})`);
    console.log(`  Label: ${field.label}`);
    console.log(`  Required: ${field.isRequired}`);
    console.log(`  Default: ${field.defaultValue}`);
});

// Check if model is in use
if (model.isInUse) {
    console.log('Model is currently being used by content items');
} else {
    console.log('Model is not currently in use');
}
```

**Error Handling:**
- Throws `Exception` when model not found

### getModelByReferenceName

Retrieves a content model by its reference name. Returns null if the model doesn't exist.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `referenceName` | `string` | Yes | The reference name of the model |
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `Model | null` - Model object or null if not found

**Usage Example:**
```typescript
const model = await apiClient.modelMethods.getModelByReferenceName('blog-post', guid);
if (model) {
    console.log('Model found:', model.displayName);
    console.log('Model ID:', model.id);
    
    // Get specific field by name
    const titleField = model.fields.find(f => f.name === 'title');
    if (titleField) {
        console.log('Title field type:', titleField.type);
        console.log('Title field required:', titleField.isRequired);
    }
} else {
    console.log('Model not found');
}

// Use in validation
const validateModelExists = async (referenceName) => {
    const model = await apiClient.modelMethods.getModelByReferenceName(referenceName, guid);
    return model !== null;
};

if (await validateModelExists('blog-post')) {
    console.log('Blog post model is available');
}
```

**Error Handling:**
- Returns `null` for 404 errors (model not found)
- Throws `Exception` for other errors

### getModelList

Retrieves a list of all content models in the current website.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `Model[]` - Array of all content models

**Usage Example:**
```typescript
const models = await apiClient.modelMethods.getModelList(guid);
console.log(`Total models: ${models.length}`);

// Display model summary
models.forEach(model => {
    console.log(`Model: ${model.displayName} (${model.referenceName})`);
    console.log(`  Fields: ${model.fields.length}`);
    console.log(`  In Use: ${model.isInUse ? 'Yes' : 'No'}`);
    console.log(`  Created: ${model.createdDate}`);
});

// Filter models by usage
const modelsInUse = models.filter(m => m.isInUse);
const unusedModels = models.filter(m => !m.isInUse);
console.log(`Models in use: ${modelsInUse.length}`);
console.log(`Unused models: ${unusedModels.length}`);

// Group by field count
const modelsByFieldCount = models.reduce((acc, model) => {
    const fieldCount = model.fields.length;
    if (!acc[fieldCount]) acc[fieldCount] = [];
    acc[fieldCount].push(model);
    return acc;
}, {});

// Find models with specific fields
const modelsWithImageFields = models.filter(model => 
    model.fields.some(field => field.type === 'image')
);
console.log(`Models with image fields: ${modelsWithImageFields.length}`);

// Create model dropdown options
const modelOptions = models.map(model => ({
    value: model.id,
    label: model.displayName,
    referenceName: model.referenceName
}));
```

**Error Handling:**
- Throws `Exception` when retrieval fails

### getModelFields

Retrieves detailed field definitions for a specific content model.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `modelID` | `number` | Yes | The model ID |
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `ModelField[]` - Array of field definitions

**Usage Example:**
```typescript
const fields = await apiClient.modelMethods.getModelFields(123, guid);
console.log(`Model has ${fields.length} fields`);

// Display detailed field information
fields.forEach(field => {
    console.log(`Field: ${field.name}`);
    console.log(`  Type: ${field.type}`);
    console.log(`  Label: ${field.label}`);
    console.log(`  Required: ${field.isRequired}`);
    console.log(`  Hidden: ${field.isHidden}`);
    console.log(`  Default: ${field.defaultValue}`);
    console.log(`  Help Text: ${field.helpText}`);
    console.log(`  Validation: ${field.validation}`);
    console.log('---');
});

// Group fields by type
const fieldsByType = fields.reduce((acc, field) => {
    if (!acc[field.type]) acc[field.type] = [];
    acc[field.type].push(field);
    return acc;
}, {});

console.log('Fields by type:');
Object.entries(fieldsByType).forEach(([type, typeFields]) => {
    console.log(`  ${type}: ${typeFields.length} fields`);
});

// Find required fields
const requiredFields = fields.filter(f => f.isRequired);
console.log(`Required fields: ${requiredFields.map(f => f.name).join(', ')}`);

// Create form validation rules
const validationRules = fields.reduce((acc, field) => {
    acc[field.name] = {
        required: field.isRequired,
        type: field.type,
        defaultValue: field.defaultValue,
        validation: field.validation
    };
    return acc;
}, {});
```

**Field Types:**
Common field types include:
- `text`: Single line text input
- `textarea`: Multi-line text input
- `html`: Rich text/HTML editor
- `number`: Numeric input
- `boolean`: Checkbox/toggle
- `date`: Date picker
- `image`: Image upload
- `file`: File upload
- `url`: URL input
- `contentReference`: Reference to other content items

**Error Handling:**
- Throws `Exception` when model not found

### saveModel

Creates a new content model or updates an existing one.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `model` | `Model` | Yes | Model object to save |
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `Model` - Saved model object with updated metadata

**Usage Example:**
```typescript
// Create a new model
const newModel = {
    referenceName: 'product-review',
    displayName: 'Product Review',
    description: 'Customer product reviews and ratings',
    fields: [
        {
            name: 'title',
            label: 'Review Title',
            type: 'text',
            isRequired: true,
            helpText: 'Enter a brief title for the review'
        },
        {
            name: 'content',
            label: 'Review Content',
            type: 'textarea',
            isRequired: true,
            helpText: 'Enter the detailed review content'
        },
        {
            name: 'rating',
            label: 'Rating',
            type: 'number',
            isRequired: true,
            validation: 'min:1,max:5',
            helpText: 'Rate from 1 to 5 stars'
        },
        {
            name: 'reviewerName',
            label: 'Reviewer Name',
            type: 'text',
            isRequired: false,
            helpText: 'Name of the person writing the review'
        },
        {
            name: 'verified',
            label: 'Verified Purchase',
            type: 'boolean',
            defaultValue: false,
            helpText: 'Check if this is a verified purchase'
        }
    ]
};

const savedModel = await apiClient.modelMethods.saveModel(newModel, guid);
console.log('Model created with ID:', savedModel.id);

// Update existing model
const existingModel = await apiClient.modelMethods.getModel(123, guid);
existingModel.displayName = 'Updated Display Name';
existingModel.description = 'Updated description';

// Add a new field
existingModel.fields.push({
    name: 'newField',
    label: 'New Field',
    type: 'text',
    isRequired: false,
    helpText: 'This is a new field'
});

const updatedModel = await apiClient.modelMethods.saveModel(existingModel, guid);
console.log('Model updated:', updatedModel.displayName);
```

**Model Structure:**
```typescript
interface Model {
    id?: number;                  // Auto-generated for new models
    referenceName: string;        // Unique identifier (required)
    displayName: string;          // Human-readable name (required)
    description?: string;         // Optional description
    fields: ModelField[];         // Array of field definitions
    isInUse?: boolean;           // Read-only property
    createdDate?: string;        // Auto-generated
    modifiedDate?: string;       // Auto-generated
}

interface ModelField {
    name: string;                // Field name/identifier
    label: string;               // Display label
    type: string;                // Field type (text, number, etc.)
    isRequired: boolean;         // Whether field is required
    isHidden?: boolean;          // Whether field is hidden in UI
    defaultValue?: any;          // Default value
    helpText?: string;           // Help text for users
    validation?: string;         // Validation rules
    options?: any[];             // Options for dropdown/select fields
}
```

**Error Handling:**
- Throws `Exception` when validation fails (duplicate reference name, invalid field types, etc.)
- Throws `Exception` when save operation fails

### deleteModel

Deletes a content model by its ID.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `modelID` | `number` | Yes | The model ID to delete |
| `guid` | `string` | Yes | Current website GUID |

**Returns:** `string` - Confirmation message of successful deletion

**Usage Example:**
```typescript
try {
    const result = await apiClient.modelMethods.deleteModel(123, guid);
    console.log(result); // "Model deleted successfully"
} catch (error) {
    if (error.message.includes('in use')) {
        console.log('Cannot delete model: currently in use by content items or containers');
        // Handle by removing dependencies first
    } else {
        console.error('Failed to delete model:', error.message);
    }
}

// Safe model deletion with checks
const safeDeleteModel = async (modelID) => {
    try {
        // Check if model is in use
        const model = await apiClient.modelMethods.getModel(modelID, guid);
        if (model.isInUse) {
            console.log(`Cannot delete model "${model.displayName}": currently in use`);
            return false;
        }
        
        // Perform deletion
        const result = await apiClient.modelMethods.deleteModel(modelID, guid);
        console.log('Model deleted successfully');
        return true;
    } catch (error) {
        console.error('Failed to delete model:', error.message);
        return false;
    }
};

// Bulk cleanup of unused models
const cleanupUnusedModels = async () => {
    const models = await apiClient.modelMethods.getModelList(guid);
    const unusedModels = models.filter(m => !m.isInUse);
    
    console.log(`Found ${unusedModels.length} unused models`);
    
    for (const model of unusedModels) {
        if (confirm(`Delete unused model "${model.displayName}"?`)) {
            await safeDeleteModel(model.id);
        }
    }
};
```

**Deletion Restrictions:**
- Cannot delete a model that is currently in use by content items
- Cannot delete a model that is assigned to containers
- Cannot delete a model that is referenced by other models

**Best Practices:**
- Always check if a model is in use before attempting deletion
- Consider archiving or renaming models instead of deleting them
- Remove all dependencies (content items, containers) before deleting a model
- Backup model definitions before deletion for potential restoration

**Error Handling:**
- Throws `Exception` when model not found
- Throws `Exception` when model is in use and cannot be deleted
- Throws `Exception` when insufficient permissions to delete models

---

## Navigation
- [← Back to Main Documentation](../README.md)
- [AssetMethods](./asset-methods.md)
- [BatchMethods](./batch-methods.md)
- [ContainerMethods](./container-methods.md)
- [ContentMethods](./content-methods.md)
- [InstanceMethods](./instance-methods.md)
- [InstanceUserMethods](./instance-user-methods.md)
- **ModelMethods** *(current)*
- [PageMethods](./page-methods.md)
- [ServerUserMethods](./server-user-methods.md)
- [WebhookMethods](./webhook-methods.md) 