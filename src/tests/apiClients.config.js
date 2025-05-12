const agility = require('@agility/content-fetch');
const mgmtApi = require('@agility/management-sdk');
const { configurations } = require('./configurations');
const axios = require('axios');
const tokenResponseData = require('./tokenResponseData.js');
const { TableClient, AzureNamedKeyCredential } = require('@azure/data-tables');
const FormData = require('form-data')

const siteGuid = configurations.guid;
const apiKeyFetch = configurations.apiKeyFetch;
const apiKeyPreview = configurations.apiKeyPreview;

const websiteName = configurations.websiteName;
const securityKey = configurations.securityKey;

const devBaseUrl = configurations.contentServerBaseUrl;

const mgmtApiBaseUrl = configurations.managementApiBaseUrl;
const account = process.env.STORAGE_ACCOUNT;
const accountKey = process.env.STORAGE_ACCOUNT_KEY;
const tableName = process.env.STORAGE_ACCOUNT_TABLE;
const tableCredentials = new AzureNamedKeyCredential(account, accountKey);
const tableStorClient = new TableClient(`https://${account}.table.core.windows.net`, tableName, tableCredentials);

let _mgmtApiClient = null;

async function createManagementSdkClient() {

    if (!_mgmtApiClient) {
        const mgmtOpt = new mgmtApi.Options();
        const authToken = await getAuthorizationToken();
        mgmtOpt.token = authToken.access_token;
        mgmtOpt.baseUrl = mgmtApiBaseUrl;
        _mgmtApiClient = new mgmtApi.ApiClient(mgmtOpt);
    }

    return { apiClient: _mgmtApiClient, guid: siteGuid };
}

function createManagementClient() {
    var mgmtApi = agilityMgmt.getApi({
        baseURL: devBaseUrl,
        websiteName: websiteName,
        securityKey: securityKey,
        debug: true
    });
    return mgmtApi;

}

function createApiClient() {
    var api = agility.getApi({
        guid: siteGuid,
        apiKey: apiKeyFetch,
        baseUrl: configurations.fetchApiBaseUrl
    });
    return api;
}


function createApiClientWithNewCdn() {
    var api = agility.getApi({
        guid: '2b64a4d8-d',
        apiKey: 'JSSDK.e27e61f56d4c9b58ab98961aaf86a0d3c544dfe7d0eb385ece42123dad5d1af7'
    });
    return api;
}

function createCachedApiClient() {
    var api = agility.getApi({
        guid: siteGuid,
        apiKey: apiKeyFetch,
        baseUrl: configurations.fetchApiBaseUrl,
        caching: {
            maxAge: 5 * 60 * 1000 //==5mins
        }
    });
    return api;
}

function createPreviewApiClient() {
    var api = agility.getApi({
        guid: siteGuid,
        apiKey: apiKeyPreview,
        isPreview: true,
        baseUrl: configurations.fetchApiBaseUrl
    });
    return api;
}

const getCurrentToken = async (partitionKey, rowKey) => {
    console.log('Get current token', partitionKey, rowKey);
    try {
        let tokenInfo = new tokenResponseData(partitionKey, rowKey);
        tokenInfo = await tableStorClient.getEntity(partitionKey, rowKey);
        return tokenInfo;
    } catch (err) {
        return null;
    }
}

// TODO: Only need to do this if the current token expires - we should store this in a global variable once per run
async function getAuthorizationToken() {
    const rowKey = process.env.TEST_ENV === "dev" ? "dev":"prod"; //TOKEN IS THE SAME IN ALL REGIONS
    const partitionKey = 'Integration-Test';
    let currentToken = await getCurrentToken(partitionKey, rowKey);
    const form = new FormData();
    let tokenInfo = new tokenResponseData(partitionKey, rowKey);
    let apiPath = `${mgmtApiBaseUrl}/oauth/refresh`;
    form.append("refresh_token", currentToken.refresh_token);
    console.log('refresh_token', currentToken.refresh_token)

    let resp = await axios.post(apiPath, form, {
        'Cache-Control': 'no-cache'
    });
    let data = JSON.stringify(resp.data);

    tokenInfo = JSON.parse(data);
    tokenInfo.partitionKey = partitionKey;
    tokenInfo.rowKey = rowKey;
    await tableStorClient.updateEntity(tokenInfo);

    return tokenInfo;
}


module.exports = {
    createManagementClient,
    createApiClient,
    createCachedApiClient,
    createPreviewApiClient,
    createApiClientWithNewCdn,
    createManagementSdkClient
}