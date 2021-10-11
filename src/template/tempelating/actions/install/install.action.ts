import { LocalPaths } from "../../../base/env/path.env";
import { TemplateEnviroment } from "../../../base/env/template.env";
import { choosePackage } from "../../../base/questions/choice/package.question";
import { Download, EDownload} from "../../../platform/download/download";
import { showSuccess } from "../../../platform/log/logger.platform";
import { cleanDownloadCachedDirectory, Install } from "./installservice.action";




export const install = async (templatePackage:string,skip:boolean):Promise<any>=>{
   const download = new Download({templatePath:LocalPaths.TEMPLATEPATH})
   const tempPath:string = await download.download(templatePackage,EDownload.TEMPLATE);
    TemplateEnviroment.packageuse = await choosePackage()
    const name = await Install(tempPath,skip)
    showSuccess(`successed to install ${name.length} from package `)
    await cleanDownloadCachedDirectory([tempPath])
}
