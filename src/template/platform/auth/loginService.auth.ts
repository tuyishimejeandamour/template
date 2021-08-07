
import { ILoginService } from "./login";


export class LoginService implements ILoginService {
    declare readonly _username:string;
    declare readonly _password:string;
    declare readonly _time;
    constructor(username:string,password:string,date:Date) {
        this._username = username;
        this._password = password;
        this._time = date;
    }

    loginP = (username: string, password: string): Promise<boolean> =>{
       return new Promise((resolve,rejects)=>{
           return true;
       })
    };
    login = ():Promise<boolean> =>{
        return new Promise((resolve,rejects)=>{
            return true;
        })
    }
    store = ():void => {

    };


}