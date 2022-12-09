
export class Options{

   // locale!: string | null;
    token!: string;
    baseUrl!: string | null;
  //  guid!: string;
    refresh_token!: string;
    duration!: number | 3000;
    retryCount!: number | 500;
    
    // determineBaseUrl(guid:string): string {

    //     var seperator = guid.split('-');

    //     if(seperator[1] === 'd'){
    //         return "https://mgmt-dev.aglty.io";
    //     }
    //     else if(seperator[1] ==='u'){
    //         return "https://mgmt.aglty.io";
    //     }
    //     else if(seperator[1] === 'ca'){
    //         return "https://mgmt-ca.aglty.io";
    //     }
    //     else if(seperator[1] === 'eu'){
    //         return "https://mgmt-aus.aglty.io";
    //     }
    //     else if(seperator[1] === 'aus'){
    //         return "https://mgmt-aus.aglty.io";
    //     }

    //     return "https://mgmt.aglty.io";
    // }
}