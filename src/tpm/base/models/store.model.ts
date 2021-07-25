export interface ITpmConfigSettings{
    getversion?:()=>string,
    getsupportedframework?:()=>IFrameworks[],
    updatesettings?:()=>void

    
}

export interface IFrameworks{
    name:string,
    version:string,

}

export interface Settings{
    isnewUser: boolean;
    version:string,
    supportedframeworks:IFrameworks[],
}

export interface Publisher{
    name:string;
    token:string;
}

