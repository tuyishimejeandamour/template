import { emit } from "cluster";
import { red, yellow } from "kleur";
import { showError } from "../log/logger.platform";
import { spawnCommand } from "./node.platform";


export interface PackageInstall {
    package: string,
    option: string,
}

export interface PackageInstallOption{
	yarn:boolean,
	npm:boolean,
	bower:boolean,
	skipMessage:boolean
}

export function PerfomInstall(
    packagemanger: string,
    paths: any,
    options: any,
    spawnOptions: any
) {
    options = options || {};
    spawnOptions = spawnOptions || {};
    paths = Array.isArray(paths) ? paths : (paths && paths.split(' ')) || [];

    let args = ['install'].concat(paths).concat(dargs(options));

    // Yarn uses the `add` command to specifically add a package to a project
    if (packagemanger === 'yarn' && paths.length > 0) {
        args[0] = 'add';
    }

    // Only for npm, use a minimum cache of one day
    if (packagemanger === 'npm') {
        args = [...args, '--cache-min', `${24 * 60 * 60}`];
    }

    // Return early if we're skipping installation
    // if (this.options.skipInstall || this.options['skip-install']) {
    //   this.log(
    //     'Skipping install command: ' +
    //       chalk.yellow(packagemanger + ' ' + args.join(' '))
    //   );
    //   return;
    // }

    spawnCommand(packagemanger, args, spawnOptions)
        .on('error', (error) => {
            showError(
                red('Could not finish installation. \n') +
                'Please install ' +
                packagemanger +
                ' with ' +
                yellow('npm install -g ' + packagemanger) +
                ' and try again. \n' +
                'If ' +
                packagemanger +
                ' is already installed, try running the following command manually: ' +
                yellow(packagemanger + ' ' + args.join(' '))
            );

            return emit('error', error);


        })
        .on('exit', (code, signal) => {
            emit(`${packagemanger}Install:end`, paths);
            if (
                (code || signal)
            ) {
                return emit(
                    'error',
                    new Error(
                        `Installation of ${packagemanger} failed with code ${code || signal
                        }`
                    )
                );
            }
        });
}

