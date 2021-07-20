import { NewTemplateAnswer } from "../../../base/models/answers.model";
import { newProjectQuestion } from "../../../base/questions/open/newTemplate.question";
import { Path } from "../../../base/utils/path";
import { readfileExist } from "../../../platform/files/file.platform";


export interface TemplateService{
    asktemplatequestion:()=>void;
    createtemplateJson:()=>void;
    watchPackageJson:()=>void;

}


export abstract class  NewTemplate  {
    
     newtemplate: NewTemplateAnswer  = Object.create(null);
     currentPath:string = process.cwd();
     overwrite:boolean = false;
     

    constructor() {
        
    }
   

    get getnewtemplate(){
      return this.newtemplate;
    }

    async ask(): Promise<NewTemplateAnswer>{
     return await newProjectQuestion();
    }

    readTpmIfexit():JSON | undefined {
     return readfileExist(new Path(this.currentPath).join('template.json'))
    }
}