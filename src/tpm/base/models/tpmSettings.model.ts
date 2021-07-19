export interface ITpmConfigSettings{
    getversion?:()=>string,
    getsupportedframework?:()=>IFrameworks[],

    
}

export interface IFrameworks{
    name:string,
    version:string,

}

export interface Settings{
    version:string,
    isupdate:number,
    supportedframeworks:IFrameworks[]
}