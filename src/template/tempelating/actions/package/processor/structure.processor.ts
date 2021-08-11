
import { TemplateEnviroment } from "../../../../base/env/template.env";
import { BaseProcessor, IFile } from "./base.processor";
import util from 'util'

/**
 * this class will process  all files and collect all files
 * return all required  file of project
 * 
 */

 export class StructureProcessor extends BaseProcessor {
	private files = new Map<string, string[]>();
	private duplicates = new Set<string>();

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
		if (TemplateEnviroment.packageStructure) {
			
            console.log(util.inspect(TemplateEnviroment.packageStructure, false, null));

		}
	}
	
}
