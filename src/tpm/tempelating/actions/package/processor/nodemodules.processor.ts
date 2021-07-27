import { writeJSONSync } from "fs-extra";
import _ from "lodash";
import { readSync } from "node:fs";
import path from "path";
import { IPackageTemplate } from "../../../../base/models/template.model";
import { yesornoQuestion } from "../../../../base/questions/choice/yesorno.question";
import { Path } from "../../../../base/utils/path";
import { checkTemplateName, validateVersion } from "../../../../platform/checking/template.checking";
import { readfileExist } from "../../../../platform/files/file.platform";
import { showWarn } from "../../../../platform/log/logger.platform";
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
    declare templateDevDependency: Dependency[];
    declare templateDependency: Dependency[];
    constructor(composition: IPackageTemplate) {
        super(composition);
   this.template = readfileExist(path.join(process.cwd(),'template.json'))
         getDevDependencies().then((a) => {
           this.templateDevDependency = a;
        });
         getPeroDependencies().then((c) => {
           this.templateDependency = c;
        });


    }

    async onFile(file: IFile): Promise<IFile> {
        const path = new Path(file.path).normalize();

        if (!/\/package.json$/i.test(path)) {
            return Promise.resolve(file);
        }

        return { ...file, mode: 0o100644 };
    }

    async onEnd(): Promise<void> {
       

        if (this.templateDependency.length >10 ) {
            throw new Error(
                "It's not allowed to use the more than 10 dependencies in template project."
            );
        }

        if (this.templateDependency.length >5 || this.templateDevDependency.length >10) {
            showWarn(`A 'repository' field is missing from the 'package.json' manifest file.`);

            if (!/^y$/i.test(await yesornoQuestion('Do you want to continue? [y/N] '))) {
                throw new Error('Aborted');
            }
        }

        this.template ={
            ...this.template,
            templateDependencies:this.templateDependency,
            templateDevDependencies : this.templateDevDependency
        }
        writeJSONSync(path.join(process.cwd(),'template.json'),this.template)
    }
   

    
}

