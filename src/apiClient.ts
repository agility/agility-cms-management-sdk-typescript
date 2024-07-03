import { ContentMethods } from "./apiMethods/contentMethods";
import { AssetMethods } from "./apiMethods/assetMethods";
import { BatchMethods } from "./apiMethods/batchMethods";
import { ContainerMethods } from "./apiMethods/containerMethods";
import { InstanceUserMethods } from "./apiMethods/instanceUserMethods";
import { ModelMethods } from "./apiMethods/modelMethods";
import { PageMethods } from "./apiMethods/pageMethods";
import { Options } from "./models/options";
import { ServerUserMethods } from "./apiMethods/serverUserMethods";

export class ApiClient {
    _options!: Options;
    contentMethods!: ContentMethods 
    assetMethods!: AssetMethods
    batchMethods!: BatchMethods
    containerMethods!: ContainerMethods 
    instanceUserMethods!: InstanceUserMethods
    modelMethods!: ModelMethods
    pageMethods!: PageMethods
    serverUserMethods!: ServerUserMethods
    constructor(options: Options){
        this._options = options;
        this.contentMethods = new ContentMethods(this._options);
        this.assetMethods = new AssetMethods(this._options);
        this.batchMethods = new BatchMethods(this._options);
        this.containerMethods = new ContainerMethods(this._options);
        this.instanceUserMethods = new InstanceUserMethods(this._options);
        this.modelMethods = new ModelMethods(this._options);
        this.pageMethods = new PageMethods(this._options);
        this.serverUserMethods = new ServerUserMethods(this._options);
    }

}