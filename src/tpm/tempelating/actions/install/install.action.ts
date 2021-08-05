import { TemplateEnviroment } from "../../../base/env/template.env";
import { choosePackage } from "../../../base/questions/choice/package.question";
import { Token } from "../../../base/utils/token.utils";
import { downloadPackage } from "../../../platform/download/download";
import { showSuccess } from "../../../platform/log/logger.platform";
import { Install } from "./installservice.action";




export const install = async (templatePackage:string):Promise<any>=>{
    const token = new Token();
   const tempPath:string = await downloadPackage(templatePackage);
    TemplateEnviroment.packageuse = await choosePackage(token)
    const name = await Install(tempPath)
    showSuccess(`successed to install ${name.length} from package `)
}