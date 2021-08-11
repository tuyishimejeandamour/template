
import { IPackageTemplate } from "../../../../base/models/template.model";
import { Path } from "../../../../base/utils/path";
import { BaseDiprocessor, InstallFile } from "./base.deprocessor";



export class CompositionDeprocessor extends BaseDiprocessor {

    private files:string[] = [];

    constructor(compositon:IPackageTemplate,path:string) {
        super(compositon,path);
        
    }


    onInit(file:InstallFile):Promise<InstallFile>{
        //    if (this.composition.templateKind == 'starter') {
        //     return Promise.resolve(file)
        //    }
        const path = new Path(file.from).normalize();
           if (/src/i.test(path)) {
               file.category = 'src';
           }else
           if (
               /\.svg$/i.test(path) ||
               /\.png$/i.test(path) ||
               /\.jpg$/i.test(path) ||
               /\.jpeg$/i.test(path) ||
               /\.pdf$/i.test(path) ||
               /\.doc$/i.test(path) 

               ) {
               file.category ='assets'
           }
           return Promise.resolve(file)
    }

    onprocess():Promise<void>{

    return Promise.resolve()
    }
}