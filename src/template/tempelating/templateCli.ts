import denodeify from "denodeify";
import * as fs from 'fs-extra'
import { LocalPaths } from "../base/env/path.env";
import { showSuccess } from "../platform/log/logger.platform";
import { getTemplateFiles, pack, readcomposition } from "./actions/package/packageService.action";
import { IPackageOptions } from "./actions/package/processor/base.processor";
import { IPluginInstallOption } from "./pluginManagement/plugin";

const stat = denodeify(fs.stat);

export function installPlugin(templatePlugin:string, option:IPluginInstallOption):Promise<any> {

    console.log(templatePlugin)
    console.log(option.global)
    console.log(option.save)

return Promise.resolve()
    
}

export const packTemplate = async (options:IPackageOptions):Promise<any>=>{

    const { packagePath, files } = await pack(options);
 const stats = await stat(packagePath) as fs.Stats;

 let size = 0;
 let unit = '';

 if (stats.size > 1048576) {
     size = Math.round(stats.size / 10485.76) / 100;
     unit = 'MB';
 } else {
     size = Math.round(stats.size / 10.24) / 100;
     unit = 'KB';
 }
 
 showSuccess(`Packaged: ${packagePath} (${files.length} files, ${size}${unit})`);
}

export const toBePublished =(cwd = LocalPaths.CWD,useYarn?: boolean,packagedDependencies?: string[]):Promise<void>=>{
    return readcomposition(cwd)
    .then(() => getTemplateFiles(cwd, useYarn, packagedDependencies))
    .then(files => {files.forEach(f => console.log(`${f}`));});
}