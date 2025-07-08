# CI/CD & Automated Environments

This guide covers using the Agility CMS Management SDK in automated environments such as CI/CD pipelines, serverless functions, and other programmatic scenarios where the OAuth flow isn't practical.

## Table of Contents

- [Overview](#overview)
- [Token-Based Authentication](#token-based-authentication)
- [Environment Configuration](#environment-configuration)
- [CI/CD Pipeline Examples](#cicd-pipeline-examples)
- [Serverless Functions](#serverless-functions)
- [Token Management](#token-management)
- [Security Best Practices](#security-best-practices)

---

## Overview

In automated environments, the interactive OAuth flow isn't practical. Instead, you'll use **access tokens** directly. This approach is ideal for:

- **CI/CD Pipelines** - Automated content deployment
- **Serverless Functions** - Event-triggered content operations
- **Scheduled Jobs** - Content synchronization, backups, etc.
- **Build Processes** - Static site generation with fresh content
- **Automated Testing** - Integration tests requiring content operations

---

## Token-Based Authentication

### Using Options Constructor

```typescript
import * as mgmtApi from '@agility/management-sdk';

// Set token via Options constructor
const options = new mgmtApi.Options();
options.token = process.env.AGILITY_API_TOKEN;

const apiClient = new mgmtApi.ApiClient(options);
// Token is automatically stored in keytar for consistency

// Ready to use immediately
const guid = process.env.AGILITY_GUID;
const locale = 'en-us';

const contentItem = await apiClient.contentMethods.getContentItem(22, guid, locale);
console.log('Content retrieved:', contentItem.fields.title);
```

### Using setToken Method

```typescript
import * as mgmtApi from '@agility/management-sdk';

// Initialize without token
const apiClient = new mgmtApi.ApiClient();

// Set token programmatically
await apiClient.setToken(process.env.AGILITY_API_TOKEN);

// Ready to use
const content = await apiClient.contentMethods.getContentList(guid, locale);
```

---

## Environment Configuration

### Environment Variables

Set up your environment variables for secure token management:

```bash
# .env file
AGILITY_API_TOKEN=your_access_token_here
AGILITY_GUID=your_website_guid
AGILITY_LOCALE=en-us
AGILITY_REGION=us  # Optional: us, ca, eu, aus, dev
```

### Loading Configuration

```typescript
import * as mgmtApi from '@agility/management-sdk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['AGILITY_API_TOKEN', 'AGILITY_GUID'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

// Initialize client with environment configuration
const options = new mgmtApi.Options();
options.token = process.env.AGILITY_API_TOKEN;

const apiClient = new mgmtApi.ApiClient(options);

// Global configuration
const config = {
    guid: process.env.AGILITY_GUID!,
    locale: process.env.AGILITY_LOCALE || 'en-us',
    region: process.env.AGILITY_REGION || 'us'
};

export { apiClient, config };
```

---

## CI/CD Pipeline Examples

### GitHub Actions

```yaml
# .github/workflows/content-deploy.yml
name: Deploy Content

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Deploy Content
      env:
        AGILITY_API_TOKEN: ${{ secrets.AGILITY_API_TOKEN }}
        AGILITY_GUID: ${{ secrets.AGILITY_GUID }}
        AGILITY_LOCALE: 'en-us'
      run: node deploy-content.js
```

```javascript
// deploy-content.js
const mgmtApi = require('@agility/management-sdk');

async function deployContent() {
    // Initialize with token from environment
    const options = new mgmtApi.Options();
    options.token = process.env.AGILITY_API_TOKEN;
    
    const apiClient = new mgmtApi.ApiClient(options);
    
    const guid = process.env.AGILITY_GUID;
    const locale = process.env.AGILITY_LOCALE;
    
    try {
        // Deploy content items
        const contentItems = [
            {
                properties: {
                    referenceName: 'deployment-notice',
                    definitionName: 'Announcement',
                    state: 2
                },
                fields: {
                    title: `Deployment ${new Date().toISOString()}`,
                    content: 'Application deployed successfully',
                    publishDate: new Date().toISOString()
                }
            }
        ];
        
        for (const item of contentItems) {
            const contentId = await apiClient.contentMethods.saveContentItem(
                item, 
                guid, 
                locale
            );
            console.log(`✅ Content created: ${contentId}`);
        }
        
        console.log('🚀 Content deployment completed successfully');
        
    } catch (error) {
        console.error('❌ Deployment failed:', error.message);
        process.exit(1);
    }
}

deployContent();
```

### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - deploy

deploy_content:
  stage: deploy
  image: node:18
  script:
    - npm ci
    - node deploy-content.js
  variables:
    AGILITY_GUID: $AGILITY_GUID
    AGILITY_LOCALE: "en-us"
  environment: production
  only:
    - main
```

### Jenkins Pipeline

```groovy
pipeline {
    agent any
    
    environment {
        AGILITY_API_TOKEN = credentials('agility-api-token')
        AGILITY_GUID = credentials('agility-guid')
        AGILITY_LOCALE = 'en-us'
    }
    
    stages {
        stage('Deploy Content') {
            steps {
                sh 'npm ci'
                sh 'node deploy-content.js'
            }
        }
    }
}
```

---

## Serverless Functions

### AWS Lambda

```typescript
import * as mgmtApi from '@agility/management-sdk';

// Initialize outside handler for connection reuse
const options = new mgmtApi.Options();
options.token = process.env.AGILITY_API_TOKEN;
const apiClient = new mgmtApi.ApiClient(options);

const config = {
    guid: process.env.AGILITY_GUID!,
    locale: process.env.AGILITY_LOCALE || 'en-us'
};

export const handler = async (event: any, context: any) => {
    try {
        // Process event data
        const { title, content, category } = JSON.parse(event.body);
        
        // Create content item
        const contentItem = {
            properties: {
                referenceName: 'api-content',
                definitionName: 'Article',
                state: 2
            },
            fields: {
                title: title,
                content: content,
                category: category,
                publishDate: new Date().toISOString()
            }
        };
        
        const contentId = await apiClient.contentMethods.saveContentItem(
            contentItem,
            config.guid,
            config.locale
        );
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                contentId: contentId,
                message: 'Content created successfully'
            })
        };
        
    } catch (error) {
        console.error('Lambda error:', error);
        
        return {
            statusCode: 500,
            body: JSON.stringify({
                success: false,
                error: error.message
            })
        };
    }
};
```

### Vercel Functions

```typescript
// api/create-content.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as mgmtApi from '@agility/management-sdk';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        // Initialize API client
        const options = new mgmtApi.Options();
        options.token = process.env.AGILITY_API_TOKEN;
        const apiClient = new mgmtApi.ApiClient(options);
        
        // Process request
        const { title, content } = req.body;
        
        const contentItem = {
            properties: {
                referenceName: 'vercel-content',
                definitionName: 'BlogPost',
                state: 2
            },
            fields: {
                title: title,
                content: content,
                publishDate: new Date().toISOString()
            }
        };
        
        const contentId = await apiClient.contentMethods.saveContentItem(
            contentItem,
            process.env.AGILITY_GUID!,
            'en-us'
        );
        
        res.status(200).json({
            success: true,
            contentId: contentId
        });
        
    } catch (error) {
        console.error('Vercel function error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
```

---

## Token Management

### Token Validation

```typescript
import * as mgmtApi from '@agility/management-sdk';

async function validateToken(token: string): Promise<boolean> {
    try {
        const options = new mgmtApi.Options();
        options.token = token;
        const apiClient = new mgmtApi.ApiClient(options);
        
        // Test token by making a simple API call
        const locales = await apiClient.instanceMethods.getLocales(
            process.env.AGILITY_GUID!
        );
        
        return locales.length > 0;
        
    } catch (error) {
        console.error('Token validation failed:', error.message);
        return false;
    }
}

// Usage in CI/CD
if (!(await validateToken(process.env.AGILITY_API_TOKEN!))) {
    console.error('❌ Invalid API token');
    process.exit(1);
}
```

### Token Rotation

```typescript
// token-rotation.js
const mgmtApi = require('@agility/management-sdk');

class TokenRotationService {
    constructor() {
        this.currentToken = process.env.AGILITY_API_TOKEN;
        this.backupToken = process.env.AGILITY_API_TOKEN_BACKUP;
    }
    
    async getWorkingToken() {
        // Try current token first
        if (await this.validateToken(this.currentToken)) {
            return this.currentToken;
        }
        
        // Fallback to backup token
        if (await this.validateToken(this.backupToken)) {
            console.warn('⚠️  Using backup token - main token may be expired');
            return this.backupToken;
        }
        
        throw new Error('No valid tokens available');
    }
    
    async validateToken(token) {
        try {
            const options = new mgmtApi.Options();
            options.token = token;
            const apiClient = new mgmtApi.ApiClient(options);
            
            await apiClient.instanceMethods.getLocales(process.env.AGILITY_GUID);
            return true;
        } catch {
            return false;
        }
    }
}

module.exports = TokenRotationService;
```

---

## Security Best Practices

### Environment Variable Security

```typescript
// security-config.ts
export class SecurityConfig {
    private static validateToken(token: string): boolean {
        // Basic token format validation
        if (!token || typeof token !== 'string') {
            return false;
        }
        
        // Check minimum length
        if (token.length < 20) {
            return false;
        }
        
        // Check for placeholder values
        const placeholders = ['your_token', 'replace_me', 'token_here'];
        return !placeholders.some(placeholder => 
            token.toLowerCase().includes(placeholder)
        );
    }
    
    static getSecureToken(): string {
        const token = process.env.AGILITY_API_TOKEN;
        
        if (!token) {
            throw new Error('AGILITY_API_TOKEN environment variable is required');
        }
        
        if (!this.validateToken(token)) {
            throw new Error('Invalid token format detected');
        }
        
        return token;
    }
    
    static getSecureConfig() {
        return {
            token: this.getSecureToken(),
            guid: process.env.AGILITY_GUID || (() => {
                throw new Error('AGILITY_GUID environment variable is required');
            })(),
            locale: process.env.AGILITY_LOCALE || 'en-us'
        };
    }
}
```

### Error Handling

```typescript
// error-handling.ts
import * as mgmtApi from '@agility/management-sdk';

export class CICDErrorHandler {
    static async executeWithRetry<T>(
        operation: () => Promise<T>,
        maxRetries: number = 3,
        delay: number = 1000
    ): Promise<T> {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await operation();
            } catch (error) {
                console.error(`Attempt ${attempt} failed:`, error.message);
                
                if (attempt === maxRetries) {
                    throw error;
                }
                
                // Exponential backoff
                const waitTime = delay * Math.pow(2, attempt - 1);
                console.log(`⏳ Retrying in ${waitTime}ms...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
        }
        
        throw new Error('All retry attempts failed');
    }
    
    static handleCICDError(error: any, context: string): never {
        console.error(`❌ CICD Error in ${context}:`, error.message);
        
        // Log additional context for debugging
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        
        // Exit with error code for CI/CD pipeline
        process.exit(1);
    }
}

// Usage example
try {
    const result = await CICDErrorHandler.executeWithRetry(async () => {
        return await apiClient.contentMethods.saveContentItem(contentData, guid, locale);
    });
    
    console.log('✅ Content saved successfully:', result);
} catch (error) {
    CICDErrorHandler.handleCICDError(error, 'content creation');
}
```

### Logging and Monitoring

```typescript
// cicd-logger.ts
export class CICDLogger {
    private static logLevel = process.env.LOG_LEVEL || 'INFO';
    
    static info(message: string, data?: any) {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] INFO: ${message}`, data || '');
    }
    
    static error(message: string, error?: any) {
        const timestamp = new Date().toISOString();
        console.error(`[${timestamp}] ERROR: ${message}`, error || '');
    }
    
    static logOperation(operation: string, guid: string, locale: string) {
        this.info(`Starting operation: ${operation}`, { guid, locale });
    }
    
    static logSuccess(operation: string, result: any) {
        this.info(`Operation completed: ${operation}`, { result });
    }
    
    static logFailure(operation: string, error: any) {
        this.error(`Operation failed: ${operation}`, error);
    }
}
```

---

## Navigation
- [← Back to Main Documentation](../README.md)
- [Authentication & Setup](./auth.md)
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
- [Multi-Instance Operations](./multi-instance-operations.md) 