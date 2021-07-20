import { NewTemplateAnswer } from "../../../base/models/answers.model";
import { newProjectQuestion } from "../../../base/questions/open/newTemplate.question";



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