import { program } from 'commander';
import { TEMPLATE } from './tpm';
import { TpmEnviroment } from './tpm/base/env/tpm.env';

import { toBePublished } from './tpm/tempelating/actions/package/package.action';
const pkg = require('../package.json')

export function index(){
  const _args = process.argv;
  new TpmEnviroment();
  program.version(pkg.version).usage('<command> [options]');

	program
		.command('ls')
		.description('Lists all the files that will be published')
		.option('--y', 'Use yarn instead of npm (default inferred from presence of yarn.lock or .yarnrc)')
		.option('--n', 'Use npm instead of yarn (default inferred from lack of yarn.lock or .yarnrc)')
		.option<string>(
			'--packagedDependencies <path>',
			'Select packages that should be published only (includes dependencies)',
			(val, all) => all? all.concat(val): val,
			undefined
		)
		.option('--ignoreFile [path]', 'Indicate alternative .vscodeignore')
		.action(({ yarn, packagedDependencies, ignoreFile }) =>
    TEMPLATE(toBePublished(undefined, yarn, packagedDependencies, ignoreFile))
		);
    program.parse(_args);
};

index();
