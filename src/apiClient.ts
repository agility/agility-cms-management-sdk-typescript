import { ContentMethods } from "./apiMethods/contentMethods";
import { AssetMethods } from "./apiMethods/assetMethods";
import { BatchMethods } from "./apiMethods/batchMethods";
import { ContainerMethods } from "./apiMethods/containerMethods";
import { InstanceUserMethods } from "./apiMethods/instanceUserMethods";
import { ModelMethods } from "./apiMethods/modelMethods";
import { PageMethods } from "./apiMethods/pageMethods";
import { Options } from "./models/options";
import { ServerUserMethods } from "./apiMethods/serverUserMethods";
import { WebhookMethods } from "./apiMethods/webhookMethods";
import { InstanceMethods } from "./apiMethods/instanceMethods";

export class ApiClient {
    _options!: Options;
    contentMethods!: ContentMethods 
    assetMethods!: AssetMethods
    batchMethods!: BatchMethods
    containerMethods!: ContainerMethods 
    instanceUserMethods!: InstanceUserMethods
    instanceMethods!: InstanceMethods
    modelMethods!: ModelMethods
    pageMethods!: PageMethods
    serverUserMethods!: ServerUserMethods
    webhookMethods!: WebhookMethods
    constructor(options: Options){
        this._options = options;
        this.contentMethods = new ContentMethods(this._options);
        this.assetMethods = new AssetMethods(this._options);
        this.batchMethods = new BatchMethods(this._options);
        this.containerMethods = new ContainerMethods(this._options);
        this.instanceUserMethods = new InstanceUserMethods(this._options);
        this.instanceMethods = new InstanceMethods(this._options);
        this.modelMethods = new ModelMethods(this._options);
        this.pageMethods = new PageMethods(this._options);
        this.serverUserMethods = new ServerUserMethods(this._options);
        this.webhookMethods = new WebhookMethods(this._options);
    }

}