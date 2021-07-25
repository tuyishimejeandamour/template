import { program } from 'commander';
import { red, yellow } from 'kleur';
import leven from 'leven';
import { TEMPLATE } from './tpm';
import { TpmEnviroment } from './tpm/base/env/tpm.env';

import { packTemplate, toBePublished } from './tpm/tempelating/actions/package/package.action';
const pkg = require('../package.json')

export function index() {
  const _args = process.argv;
  new TpmEnviroment();
  program.version(pkg.version).usage('<command> [options]');

  program
    .command('ls')
    .description('Lists all the files that will be published')
    .option('-y', 'Use yarn instead of npm (default inferred from presence of yarn.lock or .yarnrc)')
    .option('--n', 'Use npm instead of yarn (default inferred from lack of yarn.lock or .yarnrc)')
    .option<string>(
      '--packagedDependencies <path>',
      'Select packages that should be published only (includes dependencies)',
      (val, all) => all ? all.concat(val) : val,
      undefined
    )
    .action(({ yarn, packagedDependencies, ignoreFile }) =>
      TEMPLATE(toBePublished(undefined, yarn, packagedDependencies))
    );
    program
		.command('package [<version>]')
		.description('Packages an template')
		.option('--o, --out [path]', 'Output packed template file to [path] location (defaults to <name>-<version>.template)')
		.option('--y, --yarn', 'Use yarn instead of npm (default yarn if installed)')
		.option('--n, --npm', 'Use npm instead of yarn (default when yarn doesn\'t exist)')
		.action(
			(
				version,
				{
					out,
					yarn
				}
			) =>
				TEMPLATE(
					packTemplate({
						packagePath: out,
						version,
						useYarn: yarn,
					})
				)
		);

  program.on('command:*', ([cmd]: string) => {

    program.outputHelp(help => {
      const availableCommands = program.commands.map(c => c._name);
      const suggestion = availableCommands.find(c => leven(c, cmd) < c.length * 0.4);
      console.log(program.commands);
      help = `${help}
${red('Unknown command')} '${cmd}'`;

      return suggestion ? `${help}, did you mean '${yellow(suggestion)}'?\n` : `${help}.\n`;
    });
    process.exit(1);
  });
  program.parse(_args);
};

index();
