
import { IPackageTemplate } from "../../../../base/models/template.model";
import { BaseDiprocessor, InstallFile } from "./base.deprocessor";

export class CompositionDeprocessor extends BaseDiprocessor {

    private files:string[] = [];

    constructor(compositon:IPackageTemplate,path:string) {
        super(compositon,path);
        
    }


    onInit(file:InstallFile):Promise<InstallFile>{
           return Promise.resolve(file)
    }

    onprocess():Promise<void>{

    return Promise.resolve()
    }
}