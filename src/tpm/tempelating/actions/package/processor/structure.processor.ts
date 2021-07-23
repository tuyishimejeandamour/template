import { IPackageTemplate } from "../../../../base/models/template.model";
import { Path } from "../../../../base/utils/path";
import { BaseProcessor, IFile } from "./base.processor";



export class StructureProcessor extends BaseProcessor{

    constructor(composition:IPackageTemplate){
      super(composition);
    }


    async onFile(file:IFile):Promise<IFile>{
        const path = new Path(file.path).normalize();

		if (!/^extension\/package.json$/i.test(path)) {
			return Promise.resolve(file);
		}
        

		// Ensure that package.json is writable as VS Code needs to
		// store metadata in the extracted file.
		return { ...file, mode: 0o100644 };
	}
    }
