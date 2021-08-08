import denodeify from "denodeify";
import { getTemplateFiles, pack, readcomposition } from "./packageService.action";
import { IPackageOptions } from "./processor/base.processor";
import * as fs from 'fs-extra'
import { showSuccess } from "../../../platform/log/logger.platform";
import { LocalPaths } from "../../../base/env/path.env";

const stat = denodeify(fs.stat);
export const toBePublished =(cwd = LocalPaths.CWD,useYarn?: boolean,packagedDependencies?: string[]):Promise<void>=>{
    return readcomposition(cwd)
    .then(() => getTemplateFiles(cwd, useYarn, packagedDependencies))
    .then(files => {files.forEach(f => console.log(`${f}`));});
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