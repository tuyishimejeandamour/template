export interface ILoginService{
     readonly _username:string;
     readonly _password:string;
     readonly _time:Date;
    loginP:(username:string,password:string)=>Promise<boolean>;
    login:()=>Promise<boolean>;
    store:()=>void;
    
}