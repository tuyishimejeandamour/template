import { program } from 'commander';
import { red, yellow } from 'kleur';
import leven from 'leven';
import { TEMPLATE } from './template';
import { TemplateEnviroment } from './template/base/env/template.env';
import { loginPublisher } from './template/platform/store/publisherstoreService';
import { install } from './template/tempelating/actions/install/install.action';
import { installPlugin, packTemplate, toBePublished } from './template/tempelating/templateCli';
const pkg = require('../package.json')

export function index() {
  const _args = process.argv;
  new TemplateEnviroment();

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
    .action(({ yarn, packagedDependencies }) =>
      TEMPLATE(toBePublished(undefined, yarn, packagedDependencies))
    );
  program
    .command('package [<version>]')
    .description('Packages an template')
    .option('--o, --out [path]', 'Output packed template file to [path] location ↔ defaults to <name>-<version>.template')
    .action(
      (
        version,
        {
          out
        }
      ) =>
        TEMPLATE(
          packTemplate({
            packagePath: out,
            version
          })
        )
    );

  program
    .command('login <publisher>')
    .description('login to in order to publish to cloud')
    .action((name) => TEMPLATE(loginPublisher(name)));

  program
    .command('drag <package>')
    .description('install package')
    .option('--s, --skip', 'skip installation of dependencies and devdependencies')
    .action((templatePackage, { skip }) => TEMPLATE(install(templatePackage, skip)))
  program
    .command('plugin [plugin]')
    .description('install plugin for better ignoring un import files')
    .option('-g, --global', 'install for global use')
    .option('-s, --save', 'install for this project only')
    .option('-l, --list', 'list the installed plugin')
    .action((templatePackage, global) => TEMPLATE(installPlugin(templatePackage, global)))

  // program
  // 	.command('logout <publisher>')
  // 	.description('Remove a publisher from the known publishers list')
  // 	.action(name => TEMPLATE(logoutPublisher(name)));

  program.on('command:*', ([cmd]: string) => {

    program.outputHelp(help => {
      const availableCommands = program.commands.map(c => c._name);
      const suggestion = availableCommands.find(c => leven(c, cmd) < c.length * 0.4);
      help = `${help}
              ${red('Unknown command')} '${cmd}'`;

      return suggestion ? `${help}, did you mean '${yellow(suggestion)}'?\n` : `${help}.\n`;
    });
    process.exit(1);
  });
  program.parse(_args);
};


process.on('beforeExit', () => {
  console.log('⭐ ' + "thank you for using template");
})

index();


