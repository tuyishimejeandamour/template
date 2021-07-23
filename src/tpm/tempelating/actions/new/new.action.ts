import { NewTemplateAnswer } from "../../../base/models/answers.model";
import { IPackageTemplate } from "../../../base/models/template.model";
import { newProjectQuestion } from "../../../base/questions/open/newTemplate.question";
import { Path } from "../../../base/utils/path";
import { readfileExist } from "../../../platform/files/file.platform";


export interface TemplateService{
    asktemplatequestion:()=>void;
    createtemplateJson:()=>void;
    watchPackageJson:()=>void;

}


export abstract class  NewTemplate  {
    
     private _newtemplate: NewTemplateAnswer  = Object.create(null);
     currentPath:string = process.cwd();
     overwrite:boolean = false;
     private _templateSettings:IPackageTemplate = Object.create(null);
     

    constructor() {
        
    }
   

    get newtemplate(){
      return this._newtemplate;
    }

    set newtemplate(temp:NewTemplateAnswer){
       this._newtemplate = temp;
    }

    get templateSettings(){
      return this._templateSettings
    }

    set templateSettings(tems:IPackageTemplate){
      this._templateSettings = tems
    }

    async ask(): Promise<NewTemplateAnswer>{
     return await newProjectQuestion();
    }

    readTpmIfexit():IPackageTemplate | undefined {
     return readfileExist(new Path(this.currentPath).join('template.json'))
    }

    
}