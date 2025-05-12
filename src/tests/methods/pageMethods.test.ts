import { PageMethods } from '../../apiMethods/pageMethods';
import { Options } from '../../types/options';
import { ApiClientConfig } from '../config/apiClient.config';
import { Sitemap } from '../../types/sitemap';
import { PageItem } from '../../types/pageItem';
import { PageModel } from '../../types/pageModel';
import { ItemComments } from '../../types/itemComments';
import { PageHistoryResponse } from '../../types/pageHistory';

describe('PageMethods', () => {
    let pageMethods: PageMethods;
    let apiClientConfig: ApiClientConfig;
    let guid: string;

    beforeAll(async () => {
        apiClientConfig = ApiClientConfig.getInstance();
        const { apiClient, guid: instanceGuid } = await apiClientConfig.createManagementSdkClient();
        guid = instanceGuid;
        
        const options: Options = {
            token: apiClient._options.token,
            baseUrl: apiClient._options.baseUrl ?? null
            // refresh_token, duration, retryCount are optional and will be undefined
        };
        
        pageMethods = new PageMethods(options);
    });

    describe('getSitemap', () => {
        it('should retrieve sitemap for a given locale', async () => {
            const locale = 'en-us';
            const sitemap = await pageMethods.getSitemap(guid, locale);
            
            expect(sitemap).toBeDefined();
            expect(Array.isArray(sitemap)).toBe(true);
        });
    });

    describe('getPageTemplates', () => {
        it('should retrieve page templates with module zones', async () => {
            const locale = 'en-us';
            const includeModuleZones = true;
            const templates = await pageMethods.getPageTemplates(guid, locale, includeModuleZones);
            
            expect(templates).toBeDefined();
            expect(Array.isArray(templates)).toBe(true);
        });

        it('should retrieve page templates with search filter', async () => {
            const locale = 'en-us';
            const includeModuleZones = true;
            const searchFilter = 'test';
            const templates = await pageMethods.getPageTemplates(guid, locale, includeModuleZones, searchFilter);
            
            expect(templates).toBeDefined();
            expect(Array.isArray(templates)).toBe(true);
        });
    });

    describe('getPageTemplate', () => {
        it('should retrieve a specific page template by ID', async () => {
            const locale = 'en-us';
            const pageTemplateId = 1; // You'll need to use a valid template ID from your environment
            const template = await pageMethods.getPageTemplate(guid, locale, pageTemplateId);
            
            expect(template).toBeDefined();
            expect(template).toHaveProperty('pageTemplateID');
            expect(template).toHaveProperty('pageTemplateName');
        });
    });

    describe('savePageTemplate', () => {
        it('should save a new page template', async () => {
            const locale = 'en-us';
            const pageModel: PageModel = {
                doesPageTemplateHavePages: false,
                pageTemplateID: null,
                digitalChannelTypeID: null,
                digitalChannelTypeName: null,
                agilityCode: false,
                pageTemplateName: 'Test Template',
                relativeURL: null,
                pageNames: null,
                isDeleted: false,
                previewUrl: null,
                contentSectionDefinitions: []
            };

            const savedTemplate = await pageMethods.savePageTemplate(guid, locale, pageModel);
            
            expect(savedTemplate).toBeDefined();
            expect(savedTemplate.pageTemplateName).toBe(pageModel.pageTemplateName);
        });
    });

    describe('getPage', () => {
        it('should retrieve a specific page by ID', async () => {
            const locale = 'en-us';
            const pageID = 1; // You'll need to use a valid page ID from your environment
            const page = await pageMethods.getPage(pageID, guid, locale);
            
            expect(page).toBeDefined();
            expect(page).toHaveProperty('pageID');
            expect(page).toHaveProperty('name');
        });
    });

    describe('savePage', () => {
        it('should save a new page', async () => {
            const locale = 'en-us';
            const pageItem: PageItem = {
                pageID: null,
                name: 'Test Page',
                path: null,
                title: 'Test Page Title',
                menuText: null,
                pageType: null,
                templateName: null,
                redirectUrl: null,
                securePage: null,
                excludeFromOutputCache: null,
                visible: null,
                seo: null,
                scripts: null,
                dynamic: null,
                properties: null,
                zones: {},
                parentPageID: null,
                placeBeforePageItemID: null,
                channelID: null,
                releaseDate: null,
                pullDate: null
            };

            const savedPage = await pageMethods.savePage(pageItem, guid, locale);
            
            expect(savedPage).toBeDefined();
            expect(Array.isArray(savedPage)).toBe(true);
        });
    });
}); 