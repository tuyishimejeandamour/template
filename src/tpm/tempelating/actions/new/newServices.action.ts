import fs  from "fs-extra";
import { NewTemplateAnswer } from "../../../base/models/answers.model";
import { overwriteFileQuestion } from "../../../base/questions/choice/fileExist.question";
import { Path } from "../../../base/utils/path";
import { isUndefined } from "../../../platform/checking/types.checking";
import { updatejsonfile } from "../../../platform/files/file.platform";
import { NewTemplate, TemplateService } from "./new.action";



export class NewTemplateService extends NewTemplate implements TemplateService {
    
    private templateInfo = this.readTpmIfexit();
    
    constructor() {
        super();
    }
    async createtemplateJson(){
        const path = new Path(this.currentPath)
        const filepath = path.join('template.json');
         
         if (isUndefined(this.templateInfo)) {

             fs.writeJSONSync(filepath,this.newtemplate)
         }else
         {
          
          updatejsonfile(filepath,this.templateInfo,this.newtemplate);
           
         }
        
    };
    watchPackageJson():void{

    };

    async asktemplatequestion(): Promise<NewTemplateAnswer>{

        if(isUndefined(this.templateInfo)){
            return this.ask();
            
        }else{
            const question = await overwriteFileQuestion();
            if (question) {
                this.overwrite = true;
              return this.ask();
            }
        }
       
        process.exit(1);
       
    }
    



    
}