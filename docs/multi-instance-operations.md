# Multi-Instance Operations

This guide demonstrates how to perform content operations across multiple Agility CMS instances and locales using configuration-driven approaches.

## Overview

When managing content across multiple Agility CMS instances (different regions, environments, or brands), you can use a configuration matrix to create identical content across multiple instances and locales.

## Configuration Structure

Define your instance matrix using a simple configuration structure:

```typescript
interface InstanceConfig {
    guid: string;
    locales: string[];
    name?: string;        // Optional: for reporting
    region?: string;      // Optional: for regional instances
}

const instances: InstanceConfig[] = [
    { 
        guid: 'xxxxxxx-u', 
        locales: ['en-us', 'en-ca', 'fr-ca'],
        name: 'Production US',
        region: 'us'
    },
    { 
        guid: 'xxxxxxy-u', 
        locales: ['en-us'],
        name: 'Production EU',
        region: 'eu'
    }
];
```

## Basic Multi-Instance Content Creation

### Sequential Content Creation

```typescript
import * as mgmtApi from '@agility/management-sdk';

interface ContentCreationResult {
    guid: string;
    locale: string;
    success: boolean;
    contentId?: number;
    error?: string;
    instanceName?: string;
}

async function createContentAcrossInstances(
    instances: InstanceConfig[],
    contentData: any
): Promise<ContentCreationResult[]> {
    const apiClient = new mgmtApi.ApiClient();
    await apiClient.auth();
    
    const results: ContentCreationResult[] = [];
    
    for (const instance of instances) {
        for (const locale of instance.locales) {
            try {
                console.log(`Creating content in ${instance.name || instance.guid} (${locale})...`);
                
                const contentIds = await apiClient.contentMethods.saveContentItem(
                    contentData, 
                    instance.guid, 
                    locale
                );
                
                results.push({
                    guid: instance.guid,
                    locale,
                    success: true,
                    contentId: Array.isArray(contentIds) ? contentIds[0] : contentIds,
                    instanceName: instance.name
                });
                
                console.log(`✅ Success: Content created with ID ${contentIds} in ${instance.name} (${locale})`);
                
            } catch (error) {
                results.push({
                    guid: instance.guid,
                    locale,
                    success: false,
                    error: error.message,
                    instanceName: instance.name
                });
                
                console.error(`❌ Failed: ${instance.name} (${locale}) - ${error.message}`);
            }
        }
    }
    
    return results;
}

// Usage
const contentData = {
    properties: {
        referenceName: 'blog-post',
        definitionName: 'BlogPost',
        state: 2
    },
    fields: {
        title: 'Global Product Launch Announcement',
        content: 'We are excited to announce our new product...',
        publishDate: new Date().toISOString(),
        author: 'Marketing Team'
    }
};

const results = await createContentAcrossInstances(instances, contentData);
console.log('Content creation completed:', results);
```

### Parallel Processing for Better Performance

```typescript
async function createContentParallel(
    instances: InstanceConfig[],
    contentData: any
): Promise<ContentCreationResult[]> {
    const apiClient = new mgmtApi.ApiClient();
    await apiClient.auth();
    
    // Create array of all instance/locale combinations
    const operations = instances.flatMap(instance =>
        instance.locales.map(locale => ({ instance, locale }))
    );
    
    // Execute all operations in parallel
    const results = await Promise.allSettled(
        operations.map(async ({ instance, locale }) => {
            try {
                const contentIds = await apiClient.contentMethods.saveContentItem(
                    contentData,
                    instance.guid,
                    locale
                );
                
                return {
                    guid: instance.guid,
                    locale,
                    success: true,
                    contentId: Array.isArray(contentIds) ? contentIds[0] : contentIds,
                    instanceName: instance.name
                } as ContentCreationResult;
                
            } catch (error) {
                return {
                    guid: instance.guid,
                    locale,
                    success: false,
                    error: error.message,
                    instanceName: instance.name
                } as ContentCreationResult;
            }
        })
    );
    
    // Extract results from Promise.allSettled
    return results.map(result => 
        result.status === 'fulfilled' ? result.value : result.reason
    );
}

// Usage
const parallelResults = await createContentParallel(instances, contentData);
console.log('Parallel content creation completed:', parallelResults);
```

---

## Navigation
- [← Back to Main Documentation](../README.md)
- [Authentication & Setup](./auth.md)
- [CI/CD & Automated Environments](./cicd.md)
- [AssetMethods](./asset-methods.md)
- [BatchMethods](./batch-methods.md)
- [ContainerMethods](./container-methods.md)
- [ContentMethods](./content-methods.md)
- [InstanceMethods](./instance-methods.md)
- [InstanceUserMethods](./instance-user-methods.md)
- [ModelMethods](./model-methods.md)
- [PageMethods](./page-methods.md)
- [ServerUserMethods](./server-user-methods.md)
- [WebhookMethods](./webhook-methods.md)

 