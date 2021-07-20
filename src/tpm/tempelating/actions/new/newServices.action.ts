import { NewTemplate, TemplateService } from "./new.action";



export class NewTemplateService extends NewTemplate implements TemplateService {

    
    constructor() {
        super();
    }
    createtemplateJson(){

    };
    watchPackageJson():void{

    };

    asktemplatequestion():void{
       this.ask();
    }
    



    
}