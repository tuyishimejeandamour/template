
import { copyFileSync } from "fs-extra";
import { IPackageTemplate } from "../../../../base/models/template.model";
import { BaseDiprocessor, InstallFile } from "./base.deprocessor";



export class CompositionDeprocessor extends BaseDiprocessor {
    constructor(compositon:IPackageTemplate,path:string) {
        super(compositon,path);
        
    }


    onInit(file:InstallFile):Promise<InstallFile>{
        
           if (this.composition.templateKind == 'starter') {
            return Promise.resolve(file)
           }
           if (/src\/$/i.test(file.from)) {
               file.category = 'src';
           }
           if (
               /\.svg$/i.test(file.from) ||
               /\.png$/i.test(file.from) ||
               /\.jpg$/i.test(file.from) ||
               /\.jpeg$/i.test(file.from) ||
               /\.pdf$/i.test(file.from) ||
               /\.doc$/i.test(file.from) 

               ) {
               file.category ='assets'
           }
           return Promise.resolve(file)
    }
}