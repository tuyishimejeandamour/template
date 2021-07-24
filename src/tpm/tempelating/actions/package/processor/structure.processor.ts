
import { BaseProcessor, IFile } from "./base.processor";

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
		if (this.duplicates.size === 0) {
			return;
		}

		const messages = [
			`The following files have the same case insensitive path, which isn't supported by the VSIX format:`,
		];

		for (const lower of this.duplicates) {
			for (const filePath of this.files.get(lower)as string[]) {
				messages.push(`  - ${filePath}`);
			}
		}

		throw new Error(messages.join('\n'));
	}
}
