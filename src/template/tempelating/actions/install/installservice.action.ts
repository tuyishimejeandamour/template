


import denodeify from "denodeify";
import path from "path";
import { IPackageTemplate } from "../../../base/models/template.model";
import * as fs from 'fs-extra';
import minimatch from "minimatch";
const glob = require('glob');
import * as _glob from "glob";
import _ from "lodash";
import { createDefaultDeProcessors } from "../../../base/loaders/instantiation.loader";
import { IDeProcessor, InstallFile } from "./deprocessor/base.deprocessor";
import { LocalPaths } from "../../../base/env/path.env";
import { chain, flatten, sequenceExecuteFunction } from "../../../base/utils/function.utils";
import { TemplateEnviroment } from "../../../base/env/template.env";
import { Path } from "../../../base/utils/path";
import cp from 'child_process'
import { existsSync, unlinkSync } from "fs-extra";
const rimfs = require('../../../.././../resources/rim');
const exec = denodeify<string, { cwd?: string; env?: any }, { stdout: string; stderr: string }>(
	cp.exec as any,
	(err, stdout, stderr) => [err, { stdout, stderr }]
);
const __glob = denodeify<string, _glob.IOptions, string[]>(glob);
const readFile = denodeify<string, string, string>(fs.readFile);
const MinimatchOptions: minimatch.IOptions = { dot: true };

export async function readcomposition(cwd:string): Promise<IPackageTemplate> {
	const manifestPath = path.join(cwd, 'template.json');

	const manifest = readFile(manifestPath, 'utf8')
		.catch(() => Promise.reject(`Extension manifest not found: ${manifestPath}`))
		.then<IPackageTemplate>(manifestStr => {
			try {
				return Promise.resolve(JSON.parse(manifestStr));
			} catch (e) {
				return Promise.reject(`Error parsing 'package.json' manifest file: not a valid JSON file.`);
			}
		})
	
		return manifest;		
}

export function collectAllTemplateFiles(cwd: string): Promise<string[]> {
	
		const promises: Promise<string[]>[] = [cwd].map(dep => {
			return __glob('**', { cwd: dep, nodir: true, dot: true}).then((files:any[]) =>{
			return files.map(f => path.relative(cwd, path.join(dep, f))).map(f => f.replace(/\\/g, '/'))
			});
		});

		return Promise.all(promises).then(flatten);
	
	
}
export function getTemplateFiles(
	cwd: string,
): Promise<string[]> {
	return collectAllTemplateFiles(cwd).then(files => {
		files = files.filter(f => !/\r$/m.test(f));

		return (
			     Promise.all(['template.json'])
				// Filter out files
				.then((file) =>
					files.filter(
						f =>
							!file.some(i => minimatch(f, i, MinimatchOptions)) 
					)
				)
		);
	});
}


export async function Install(temppath:string,installoption:boolean): Promise<InstallFile[]> {
	const cwd = temppath;

	TemplateEnviroment.packageJson = await readcomposition(cwd);

	const files = await gatherFileToInstall(TemplateEnviroment.packageJson,cwd,installoption);
	const jsFiles = files.filter(f => /\.js$/i.test(f.from));

	if (files.length > 5000 || jsFiles.length > 100) {
		console.log(
			`This extension consists of ${files.length} files, out of which ${jsFiles.length} are JavaScript files. For performance reasons, you should bundle your extension: https://aka.ms/vscode-bundle-extension . You should also exclude unnecessary files by adding them to your .vscodeignore: https://aka.ms/vscode-vscodeignore`
		);                
	}
   
	return  files ;
}
export function gatherFileToInstall(composition: IPackageTemplate,temppath:string,installopt?:boolean): Promise<InstallFile[]> {
	const cwd =  temppath;
	
	const processors = createDefaultDeProcessors(composition,cwd,installopt);
	return getTemplateFiles(cwd).then(fileNames => {
		const files = fileNames.map(f => ({ from:path.join(cwd,f),category:undefined, to: path.join(LocalPaths.CWD, f) }));
		return processTemplate(processors, files);
	});
}

export async function processTemplate(processors: IDeProcessor[], files: InstallFile[]): Promise<InstallFile[]> {
	const processedFiles = files.map(file => chain(file, processors, (file, processor) => processor.onInit(file)));
	return Promise.all(processedFiles).then(files => {
		return sequenceExecuteFunction(processors.map(p => () => p.onprocess())).then(() => {
			return files
		});
	});
}

export async function cleanDownloadCachedDirectory(downloadpath:string[]){
	
    if (downloadpath.length >0) {
	downloadpath.forEach((pa)=>{
		const pas = new Path(pa).normalize();
		const pasarray = pas.split('/');
		const arr1 = pasarray.slice(0,pasarray.length-1);
		//delete extracted folder
		rimfs(arr1.join('/'), fs, (er: any)=>{
			if (er)
			throw er
		})
        //delete downloaded file compressed
		const file = path.join(pasarray.slice(0,pasarray.length-2).join('/'),arr1.pop() as string+'.template');
		console.log(file)
		if (existsSync(file)) {
			unlinkSync(file)
		}
	})
		
	}else{
    return
	}
   
}