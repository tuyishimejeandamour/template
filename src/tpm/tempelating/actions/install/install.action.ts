import { downloadPackage } from "../../../platform/download/download";
import { showSuccess } from "../../../platform/log/logger.platform";
import { unpackAndInstall } from "./installservice.action";




export const install = async (templatePackage:string):Promise<any>=>{
    console.log(templatePackage);
   const tempPath:string = await downloadPackage(templatePackage);
    const name = await unpackAndInstall(tempPath)
    showSuccess(`successed to install  from package `)

   //return Promise.resolve()
}