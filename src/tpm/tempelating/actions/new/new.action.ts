import { NewTemplateAnswer } from "../../../base/models/answers.model";
import { newProjectQuestion } from "../../../base/questions/open/newTemplate.question";


export interface TemplateService{
    asktemplatequestion:()=>void;
    createtemplateJson:()=>void;
    watchPackageJson:()=>void;

}


export class  NewTemplate  {
    
    private newtemplate: NewTemplateAnswer  = Object.create(null);

    constructor() {
        
    }
   

    get getnewtemplate(){
      return this.newtemplate;
    }

    async ask():Promise<void>{
     this.newtemplate = await newProjectQuestion();
    }
}