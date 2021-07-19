export interface ITpmUserConfigSettings{
    readonly _version:string,
    readonly supportedframework:IFrameworks[],
    readonly lastUpdateCheck:number
    getversion?:()=>string,
    getsupportedframework?:()=>IFrameworks[],

    
}

export interface IFrameworks{
    name:string,
    version:string,

}