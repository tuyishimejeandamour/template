import { writeJSONSync } from "fs-extra";
import _ from "lodash";
import { readSync } from "node:fs";
import path from "path";
import { IPackageTemplate } from "../../../../base/models/template.model";
import { yesornoQuestion } from "../../../../base/questions/choice/yesorno.question";
import { Path } from "../../../../base/utils/path";
import { checkTemplateName, validateVersion } from "../../../../platform/checking/template.checking";
import { readfileExist } from "../../../../platform/files/file.platform";
import { showInfo, showWarn } from "../../../../platform/log/logger.platform";
import { getDevDependencies, getPeroDependencies } from "../packageService.action";
import { BaseProcessor, Dependency, IFile } from "./base.processor";
/**
 * this will be file which will focus on sorting nodemodules and insert theme in dev and dependences
 * on file it will load all dependencies 
 * the it load some nodemodule according the specific framework
 * this will be in .extensions files
 * this class will load requirement according to framwork specified
 * 
 */

export class NodemodulesProcessor extends BaseProcessor {
    constructor(composition: IPackageTemplate) {
        super(composition);
         this.template = readfileExist(path.join(process.cwd(),'template.json'))
        

    }

    async onFile(file: IFile): Promise<IFile> {
        const path = new Path(file.path).normalize();

        if (!/\/package.json$/i.test(path)) {
            return Promise.resolve(file);
        }

        return { ...file, mode: 0o100644 };
    }

    async onEnd(): Promise<void> {
        getDevDependencies().then((a) => {
            writeJSONSync(path.join(process.cwd(),'template.json'),{...this.template,templateDevDependencies : a})
         });
          getPeroDependencies().then((c) => {
            writeJSONSync(path.join(process.cwd(),'template.json'),{...this.template,templateDependencies:c})

         });
       // console.log("hello there");
        // if (this.templateDependency.length >10 ) {
        //     throw new Error(
        //         "It's not allowed to use the more than 10 dependencies in template project."
        //     );
        // }
       // console.log("hello there 2");
        // if (this.templateDependency.length >5 || this.templateDevDependency.length >10) {
        //     showInfo(`template 'files' field is missing from the 'package.json' manifest file.`);
        // }
       
    }
   

    
}

