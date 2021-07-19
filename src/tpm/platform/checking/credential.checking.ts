
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