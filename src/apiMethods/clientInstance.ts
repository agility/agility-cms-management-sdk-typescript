import axios, { AxiosInstance } from 'axios';
import { Options } from "../models/options";

export class ClientInstance{
 
    getInstance(options: Options) : AxiosInstance{
       let baseUrl = options.determineBaseUrl(options.guid);
       let instance =  axios.create({
            baseURL: `${baseUrl}/api/v1/instance/${options.guid}`
        })
        return instance;
    }

    async executeGet(apiPath: string, options: Options){
        let instance = this.getInstance(options);
        try{
            const resp = await instance.get(apiPath, {
                headers: {
                  'Authorization': `Bearer ${options.token}`,
                  'Cache-Control': 'no-cache'
                }
              })
            return resp;
        }
        catch(err){
            throw err;
        }
        
    }

    async executeDelete(apiPath: string, options: Options){
        let instance = this.getInstance(options);
        try{
            const resp = await instance.delete(apiPath, {
                headers: {
                  'Authorization': `Bearer ${options.token}`,
                  'Cache-Control': 'no-cache'
                }
              })
            return resp;
        }
        catch(err){
            throw err;
        }
    }

    async executePost(apiPath: string, options: Options, data: any){
        let instance = this.getInstance(options);
        try{
            const resp = await instance.post(apiPath,data, {
                headers: {
                  'Authorization': `Bearer ${options.token}`,
                  'Cache-Control': 'no-cache'
                }
              })
            return resp;
        }
        catch(err){
            throw err;
        }
    }
}