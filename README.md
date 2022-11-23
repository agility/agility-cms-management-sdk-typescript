# Agility CMS & Management API TypeScript SDK

## About the Management API SDK

- Provides a facility to developers to use the new Agility Management API more effectively.
- Provides methods to perform operations on Assets, Batches, Containers, Content, Models, Pages, and Users.
- Supports the creation of Pages and Content in batches.
- Ability to generate Content in bulk for a Website.

## Getting Started

### Prerequisites
1. Clone the repository agility-cms-management-sdk-typescript.
2. Import the index file to make use of the Options class.
3. Create an object of the Options class to provide values of - 
	- token -> Bearer token to authenticate a Rest Request to perform an operation.
	- locale -> The locale under which your application is hosted. Example en-us.
    - guid -> The guid under which your application is hosted.
4. Create an object of Method class(es), which can be used to create and perform operations. Following is the description of Classes and their respective methods -

### Making a Request
```Javascript
import * as index from "./index";

//initialize the Options Class
let options = new index.Options();

options.token = "<<Provide Auth Token>>";
options.guid = "<<Provide the Guid of the Website>>";
options.locale = "<<Provide the locale of the Website>>"; //Example: en-us

//Initialize the Method Class
let contentMethods = new index.ContentMethods(options);

//make the request: get a content item with the ID '22'
var contentItem = await contentMethods.getContentItem(22);

//To log the response of the contentItem object in console.
console.log(JSON.stringify(contentItem));
```
## Class AssetMethods
This class is used to perform operations related to Assets. The following are the methods: - 

### upload
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `formData` | `FormData` | This is an object of type FormData where files can be posted eg : `const file = fs.readFileSync(<<Local File>>, null);const form = new FormData(); form.append('files',file,'<<File Name>>');`|
| `agilityFolderPath` | `string` | Path of the folder in Agility where the file(s) needs to be uploaded.|
| `groupingID` | `number` | Path of the folder in Agility where the file(s) needs to be uploaded.|

Returns: A collection of ```Media``` class Object.

### deleteFile
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `mediaID` | `number` | The mediaID of the asset which needs to be deleted.|
Returns
A ```string``` response if a file has been deleted.

### moveFile
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `mediaID` | `number` | The mediaID of the file that needs to be moved.|
| `newFolder` | `string` | The new location (in Agility) where the file needs to be moved.|

Returns: An object of ```Media``` class with the new location of the file.

### getMediaList
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `pageSize` | `number` | The page size on which the assets needs to selected.|
| `recordOffset` | `number` | The record offset value to skip search results.|

Returns: An object of ```AssetMediaList``` class.

### getAssetByID
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `mediaID` | `number` | The mediaID of the requested asset.|

Returns: An object of ```Media``` class with the information of the asset.

### getAssetByUrl
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `url` | `string` | The url of the requested asset.|

Returns: An object of ```Media``` class with the information of the asset.

## Class BatchMethods
This class is used to perform operations related to Batches. The following are the methods: - 

### getBatch
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `number` | The batchID of the requested batch.|

Returns: A object of ```Batch``` class.

## Class ContainerMethods
This class is used to perform operations related to Containers. The following are the methods: - 

### getContainerByID
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `number` | The container id of the requested container.|

Returns: A object of ```Container``` class.

### getContainerByReferenceName
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `referenceName` | `string` | The container reference name of the requested container.|

Returns: A object of ```Container``` class.

### getContainerSecurity
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `number` | The container id of the requested container.|

Returns: A object of ```Container``` class.

### getContainerList
Returns: A collection object of ```Container``` class.

### getNotificationList
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `number` | The container id of the requested container.|

Returns: A collection object of ```Notification``` class.

### saveContainer
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `container` | `Container` | A Container type object to create or update a container.|

Returns: An object of ```Container``` class.

### deleteContainer
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `number` | The container id of the requested container.|

Returns: A ```string``` response if a container has been deleted.

## Class ContentMethods
This class is used to perform operations related to Content. The following are the methods: - 

### getContentItem
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `contentID` | `number` | The contentid of the requested content.|

Returns: An object of ```ContentItem``` class.

### publishContent
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `contentID` | `number` | The contentid of the requested content.|
| `comments` | `string` | Additional comments for a batch request.|

Returns: An array of ```contentID``` of the requested content.

### unPublishContent
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `contentID` | `number` | The contentid of the requested content.|
| `comments` | `string` | Additional comments for a batch request.|

Returns: An array of ```contentID``` of the requested content.

### contentRequestApproval
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `contentID` | `number` | The contentid of the requested content.|
| `comments` | `string` | Additional comments for a batch request.|

Returns: An array of ```contentID``` of the requested content.

### approveContent
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `contentID` | `number` | The contentid of the requested content.|
| `comments` | `string` | Additional comments for a batch request.|

Returns: An array of ```contentID``` of the requested content.

### declineContent
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `contentID` | `number` | The contentid of the requested content.|
| `comments` | `string` | Additional comments for a batch request.|

Returns: An array of ```contentID``` of the requested content.

### saveContentItem
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `contentItem` | `ContentItem` | A contentItem object to create or update a content.|

Returns: An array of ```contentID``` of the requested content.

### saveContentItems
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `contentItems` | `ContentItem[]` | A collection of contentItems object to create or update multiple contents.|

Returns: An array of ```contentID``` of the requested content.

### deleteContent
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `contentID` | `number` | The contentid of the requested content.|
| `comments` | `string` | Additional comments for a batch request.|

Returns: An array of ```contentID``` of the requested content.

### getContentItems
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `referenceName` | `string` | The reference name of the container for the requested content.|
| `filter` | `string` | The filter condition for the requested content.|
| `fields` | `string` | The fields mapped to the container.|
| `sortDirection` | `string` | The direction to sort the result.|
| `sortField` | `string` | The field on which the sort needs to be performed.|
| `take` | `number` | The page size for the result.|
| `skip` | `number` | The record offset for the result.|

Returns: An object of ```ContentList``` class of the requested content.

## Class InstanceUserMethods
This class is used to perform operations related to User. The following are the methods: - 

### getUsers
Returns: A collection of ```WebsiteUser``` class of the requested content.

### saveUser
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `emailAddress` | `string` | The email address of the requested user.|
| `roles` | `InstanceRole[]` | Collection object of InstanceRole class for the requested user.|
| `firstName` | `string` | The first name of the requested user.|
| `lastName` | `string` | The last name of the requested user.|

Returns: An object of the ```InstanceUser``` class.

### deleteUser
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `userID` | `number` | The userID of the requested user.|

Returns: A ```string``` response if a user has been deleted.

## Class ModelMethods
This class is used to perform operations related to Models. The following are the methods: - 

### getContentModel
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `number` | The id of the requested model.|

Returns: An object of ```Model``` class.

### getContentModules
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `includeDefaults` | `bool` | Boolean value to include defaults.|
| `includeModules` | `bool` | Boolean value to include modules.|

Returns: A collection object of ```Model``` class.

### getPageModules
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `includeDefault` | `bool` | Boolean value to include defaults.|

Returns: A collection object of ```Model``` class.

### saveModel
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `model` | `Model` | The object of Model to for the requested model.|

Returns: An object of ```Model``` class.

### deleteModel
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `number` | The id for the requested model.|

Returns: A ```string``` response if a model is deleted.

## Class PageMethods
This class is used to perform operations related to Pages. The following are the methods: - 

### getSitemap
Returns: A collection object of ```Sitemap``` class.

### getPage
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `pageID` | `number` | The id of the requested page.|

Returns: An object of ```PageItem``` class.

### publishPage
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `pageID` | `number` | The pageID of the requested page.|
| `comments` | `string` | Additional comments for a batch request.|

Returns: An array of ```pageID``` of the requested page.

### unPublishPage
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `pageID` | `number` | The pageID of the requested page.|
| `comments` | `string` | Additional comments for a batch request.|

Returns: An array of ```pageID``` of the requested page.

### deletePage
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `pageID` | `number` | The pageID of the requested page.|
| `comments` | `string` | Additional comments for a batch request.|

Returns: An array of ```pageID``` of the requested page.

### approvePage
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `pageID` | `number` | The pageID of the requested page.|
| `comments` | `string` | Additional comments for a batch request.|

Returns: An array of ```pageID``` of the requested page.

### declinePage
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `pageID` | `number` | The pageID of the requested page.|
| `comments` | `string` | Additional comments for a batch request.|

Returns: An array of ```pageID``` of the requested page.

### pageRequestApproval
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `pageID` | `number` | The pageID of the requested page.|
| `comments` | `string` | Additional comments for a batch request.|

Returns: An array of ```pageID``` of the requested page.

### savePage
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `pageItem` | `PageItem` | The object of PageItem class for the requested Page.|
| `parentPageID` | `number` | The id of the parent page.|
| `placeBeforePageItemID` | `number` | The id of the page before the page.|

Returns: An array of ```pageID``` of the requested page.


## Running the SDK Locally

- `npm run clean`
- `npm run prepare`
- `npm run build` 

## How It Works

- [How Pages Work](https://help.agilitycms.com/hc/en-us/articles/4404222849677)
- [How Page Modules Work](https://help.agilitycms.com/hc/en-us/articles/4404222989453)
- [How Page Templates Work](https://help.agilitycms.com/hc/en-us/articles/4404229108877)

## Resources

### Agility CMS

- [Official site](https://agilitycms.com)
- [Documentation](https://help.agilitycms.com/hc/en-us)

### Community

- [Official Slack](https://join.slack.com/t/agilitycommunity/shared_invite/enQtNzI2NDc3MzU4Njc2LWI2OTNjZTI3ZGY1NWRiNTYzNmEyNmI0MGZlZTRkYzI3NmRjNzkxYmI5YTZjNTg2ZTk4NGUzNjg5NzY3OWViZGI)
- [Blog](https://agilitycms.com/resources/posts)
- [GitHub](https://github.com/agility)
- [Forums](https://help.agilitycms.com/hc/en-us/community/topics)
- [Facebook](https://www.facebook.com/AgilityCMS/)
- [Twitter](https://twitter.com/AgilityCMS)

## Feedback and Questions

If you have feedback or questions about this starter, please use the [Github Issues](https://github.com/agility/agility-cms-management-sdk-typescript/issues) on this repo, join our [Community Slack Channel](https://join.slack.com/t/agilitycommunity/shared_invite/enQtNzI2NDc3MzU4Njc2LWI2OTNjZTI3ZGY1NWRiNTYzNmEyNmI0MGZlZTRkYzI3NmRjNzkxYmI5YTZjNTg2ZTk4NGUzNjg5NzY3OWViZGI) or create a post on the [Agility Developer Community](https://help.agilitycms.com/hc/en-us/community/topics).