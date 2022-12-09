import axios, { AxiosInstance } from 'axios';
import { Options } from "../models/options";

export class ClientInstance{
 
    determineBaseUrl(guid:string): string {

        var seperator = guid.split('-');

        if(seperator[1] === 'd'){
            return "https://mgmt-dev.aglty.io";
        }
        else if(seperator[1] ==='u'){
            return "https://mgmt.aglty.io";
        }
        else if(seperator[1] === 'ca'){
            return "https://mgmt-ca.aglty.io";
        }
        else if(seperator[1] === 'eu'){
            return "https://mgmt-aus.aglty.io";
        }
        else if(seperator[1] === 'aus'){
            return "https://mgmt-aus.aglty.io";
        }

        return "https://mgmt.aglty.io";
    }

    getInstance(guid: string) : AxiosInstance{
       let baseUrl = this.determineBaseUrl(guid);
       let instance =  axios.create({
            baseURL: `${baseUrl}/api/v1/instance/${guid}`
        })
        return instance;
    }

    async executeGet(apiPath: string, guid: string, token: string){
        let instance = this.getInstance(guid);
        try{
            const resp = await instance.get(apiPath, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Cache-Control': 'no-cache'
                }
              })
            return resp;
        }
        catch(err){
            throw err;
        }
        
    }

    async executeDelete(apiPath: string, guid: string, token: string){
        let instance = this.getInstance(guid);
        try{
            const resp = await instance.delete(apiPath, {
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Cache-Control': 'no-cache'
                }
              })
            return resp;
        }
        catch(err){
            throw err;
        }
    }

    async executePost(apiPath: string, guid: string, token: string, data: any){
        let instance = this.getInstance(guid);
        try{
            const resp = await instance.post(apiPath,data, {
                headers: {
                  'Authorization': `Bearer ${token}`,
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