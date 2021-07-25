
export interface ICredential{
    isloggedin :(token:string)=>true|false;
    isTokenValid:(token:string)=>true|false;
    login:(username:string,password:string)=>string
}


export class CredentialChecking implements ICredential {
    constructor() {
        
    }
    isloggedin = (token: string):boolean => {
        return true;
    };
    isTokenValid = (token: string): boolean =>{
       return false;
    };
    login= (username: string, password: string):string =>{
         return "";
    };
}

export function validateName(name:string){
    if(!/^[a-z0-9][a-z0-9\-]*$/i.test(name)){
        throw new Error("invalid publisher Name");
        
      };
   return true;     
}