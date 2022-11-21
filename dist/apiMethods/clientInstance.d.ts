import { AxiosInstance } from 'axios';
import { Options } from "../models/options";
export declare class ClientInstance {
    getInstance(options: Options): AxiosInstance;
    executeGet(apiPath: string, options: Options): Promise<import("axios").AxiosResponse<any, any>>;
    executeDelete(apiPath: string, options: Options): Promise<import("axios").AxiosResponse<any, any>>;
    executePost(apiPath: string, options: Options, data: any): Promise<import("axios").AxiosResponse<any, any>>;
}
