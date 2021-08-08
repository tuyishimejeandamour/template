import { TemplateEnviroment } from "../../../base/env/template.env";
import { choosePackage } from "../../../base/questions/choice/package.question";
import { Token } from "../../../base/utils/token.utils";
import { downloadPackage } from "../../../platform/download/download";
import { showSuccess } from "../../../platform/log/logger.platform";
import { Install } from "./installservice.action";




export const install = async (templatePackage:string,skip:boolean):Promise<any>=>{

   const tempPath:string = await downloadPackage(templatePackage);
    TemplateEnviroment.packageuse = await choosePackage()
    const name = await Install(tempPath,skip)
    showSuccess(`successed to install ${name.length} from package `)
}