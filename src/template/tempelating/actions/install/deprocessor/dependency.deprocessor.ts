import assert from "assert";
import { yellow } from "kleur";
import _ from "lodash";
import { IPackageTemplate } from "../../../../base/models/template.model";
import { showInfo } from "../../../../platform/log/logger.platform";
import { PackageInstallOption, PerfomInstall } from "../../../../platform/node/install.platform";
import { BaseDiprocessor, InstallFile } from "./base.deprocessor";




export class DependenciesDeprocessor extends BaseDiprocessor {
    private skipInstall: boolean;
    constructor(compositon: IPackageTemplate, path: string, skipInstall: boolean) {
        super(compositon, path)
        this.skipInstall = skipInstall
    }

    onInit(file: InstallFile): Promise<InstallFile> {

        return Promise.resolve(file)

    }

    onprocess(): Promise<void> {
        

        return Promise.resolve()
    }

    installDependencies(_package:string[],options: PackageInstallOption) {
        options = options || {};
        const message = {
            commands: [] as string[],
            template: _.template(
                "\n\nI'm all done. " +
                '<%= skipInstall ? "Just run" : "Running" %> <%= commands %> ' +
                '<%= skipInstall ? "" : "for you " %>to install the required dependencies.' +
                '<% if (!skipInstall) { %> If this fails, try running the command yourself.<% } %>\n\n'
            )
        };

        const getOptions = (options: any) => {
            return typeof options === 'object' ? options : null;
        };

        if (options.npm !== false) {
            message.commands.push('npm install');
            this.npmInstall(null, getOptions(options.npm));
        }

        if (options.yarn) {
            message.commands.push('yarn install');
            this.yarnInstall(null, getOptions(options.yarn));
        }

        if (options.bower) {
            message.commands.push('bower install');
            this.bowerInstall(null, getOptions(options.bower));
        }

        assert(
            message.commands.length,
            'installDependencies needs at least one of `npm`, `bower` or `yarn` to run.'
        );

        if (!options.skipMessage) {
            const tplValues = _.extend(
                {
                    skipInstall: typeof this.skipInstall != 'undefined' ? true : false
                },
                {
                    commands: yellow(message.commands.join(' && '))
                }
            );
            showInfo(message.template(tplValues));
        }
    };

    bowerInstall(cmpnt: any, options: any, spawnOptions?: any) {
        PerfomInstall('bower', cmpnt, options, spawnOptions);
    };


    npmInstall(pkgs: any, options: any, spawnOptions?: any) {
        PerfomInstall('npm', pkgs, options, spawnOptions);
    };


    yarnInstall(pkgs:any, options:any, spawnOptions?:any) {
        PerfomInstall('yarn', pkgs, options, spawnOptions);
        
    };

    

}