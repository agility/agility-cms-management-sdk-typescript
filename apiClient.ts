import { ContentMethods } from "./src/apiMethods/contentMethods";
import { AssetMethods } from "./src/apiMethods/assetMethods";
import { BatchMethods } from "./src/apiMethods/batchMethods";
import { ContainerMethods } from "./src/apiMethods/containerMethods";
import { InstanceUserMethods } from "./src/apiMethods/instanceUserMethods";
import { ModelMethods } from "./src/apiMethods/modelMethods";
import { PageMethods } from "./src/apiMethods/pageMethods";
import { Options } from "./src/models/options";

export class ApiClient {
    _options!: Options;
    contentMethods!: ContentMethods 
    assetMethods!: AssetMethods
    batchMethods!: BatchMethods
    containerMethods!: ContainerMethods 
    instanceUserMethods!: InstanceUserMethods
    modelMethods!: ModelMethods
    pageMethods!: PageMethods
    constructor(options: Options){
        this._options = options;
        this.contentMethods = new ContentMethods(this._options);
        this.assetMethods = new AssetMethods(this._options);
        this.batchMethods = new BatchMethods(this._options);
        this.containerMethods = new ContainerMethods(this._options);
        this.instanceUserMethods = new InstanceUserMethods(this._options);
        this.modelMethods = new ModelMethods(this._options);
        this.pageMethods = new PageMethods(this._options);
    }

}