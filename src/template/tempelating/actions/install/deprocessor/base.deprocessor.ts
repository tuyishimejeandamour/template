import { IPackageTemplate } from "../../../../base/models/template.model";

export interface IDeProcessor{
    path:string,
    composition:IPackageTemplate
    onInit:(file:InstallFile)=>Promise<InstallFile>
    onprocess:()=>Promise<void>
}


export interface InstallFile{
    category?:string,
    from:string,
    to:string,
    readonly contents?:Buffer | string
}

export interface Creator {
    name:string,
    link:string,
    donate:string,
    constribution:string[]
}

export interface InstallResult{
    files:InstallFile[],
    name:string,
    version:string,
    creator?:Creator,
    

}

export class BaseDiprocessor implements IDeProcessor {
    path: string;
    composition: IPackageTemplate;
    constructor(composition:IPackageTemplate,path:string) {
        this.path = path;
        this.composition = composition
    }
    
    onInit(file: InstallFile):Promise<InstallFile>{
      return Promise.resolve(file)
    };
    
    onprocess():Promise<void>{
        return Promise.resolve()
    };
}