
import { copyFileSync } from "fs-extra";
import { IPackageTemplate } from "../../../../base/models/template.model";
import { BaseDiprocessor, InstallFile } from "./base.deprocessor";



export class CompositionDeprocessor extends BaseDiprocessor {
    constructor(compositon:IPackageTemplate,path:string) {
        super(compositon,path);
        console.log("there i am")
    }


    onInit(file:InstallFile):Promise<InstallFile>{
        
        copyFileSync(file.from,file.to)
        return Promise.resolve(file)
    }
}