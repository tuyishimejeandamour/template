
import { TemplateEnviroment } from "../../../../base/env/template.env";
import { BaseProcessor, IFile } from "./base.processor";
import util from 'util'
import { existsSync, readFileSync, writeJSONSync } from "fs-extra";
import path from "path";
import { LocalPaths } from "../../../../base/env/path.env";
import { showInfo } from "../../../../platform/log/logger.platform";

/**
 * this class will process  all files and collect all files
 * return all required  file of project
 * 
 */

 export class StructureProcessor extends BaseProcessor {
	private files = new Map<string, string[]>();
	private duplicates = new Set<string>();
    private templateComposition:any;
	async onFile(file: IFile): Promise<IFile> {
		const lower = file.path.toLowerCase();
		const existing = this.files.get(lower);

		if (existing) {
			this.duplicates.add(lower);
			existing.push(file.path);
		} else {
			this.files.set(lower, [file.path]);
		}

		return file;
	}

	async onEnd() {
		if (existsSync(path.join(LocalPaths.CWD, 'template.json'))) {
			showInfo("template.json exit we will use it");
			this.templateComposition = JSON.parse(readFileSync(path.join(LocalPaths.CWD, 'template.json')).toString());
		}
		if (TemplateEnviroment.packageStructure) {
			
			this.template = {
				...this.templateComposition,
				templatestructure:TemplateEnviroment.packageStructure
			}
			
			writeJSONSync(path.join(LocalPaths.CWD, 'template.json'), this.template)
           // console.log(util.inspect(TemplateEnviroment.packageStructure, false, null));

		}
	}

	private displayTree(){
         
		


	}
	
}
