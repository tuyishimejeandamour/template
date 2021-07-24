import _ from "lodash";
import { IPackageTemplate } from "../../../../base/models/template.model";
import { yesornoQuestion } from "../../../../base/questions/choice/yesorno.question";
import { getRepository, getUrl, isGitHubRepository } from "../../../../base/utils/node.utils";
import { Path } from "../../../../base/utils/path";
import { checkTemplateName, validateVersion } from "../../../../platform/checking/template.checking";
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
    declare templateDevDependencies: Dependency[];
    declare templateDependencies: Dependency[];
    constructor(composition: IPackageTemplate) {
        super(composition);

         getDevDependencies().then((a) => {
           this.templateDevDependencies = a;
        });
         getPeroDependencies().then((c) => {
           this.templateDependencies = c;
        });


    }

    async onFile(file: IFile): Promise<IFile> {
        const path = new Path(file.path).normalize();

        if (!/^extension\/package.json$/i.test(path)) {
            return Promise.resolve(file);
        }


        return { ...file, mode: 0o100644 };
    }

    async onEnd(): Promise<void> {
        if (typeof this.composition.templateKind === 'string') {
            showWarn(
                `The 'templateKind' property should be of type 'string[]'`
            );
        }

        if (this.composition.publisher === 'templatepublisher') {
            throw new Error(
                "It's not allowed to use the 'templatepublisher' publisher."
            );
        }

        if (!this.composition.repository) {
            showWarn(`A 'repository' field is missing from the 'package.json' manifest file.`);

            if (!/^y$/i.test(await yesornoQuestion('Do you want to continue? [y/N] '))) {
                throw new Error('Aborted');
            }
        }
    }
    static validatecomposition(composition: IPackageTemplate): IPackageTemplate {
        checkTemplateName(composition.name);

        if (!composition.version) {
            throw new Error('Manifest missing field: version');
        }

        validateVersion(composition.version);


        return composition;
    }
}

