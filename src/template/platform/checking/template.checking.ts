import { blue, cyan, green, red } from "kleur";
import fs from "fs-extra";
import path from "path";
import * as semver from 'semver';
import { validateTemplateName } from "../../base/utils/function.utils";
export function checkTemplateName(templateName:string) {
    const validationResult = validateTemplateName(templateName);
    if (!validationResult.validForNewPackages) {
      console.error(
        red(
          `Cannot create a project named ${green(
            `"${templateName}"`
          )} because of npm naming restrictions:\n`
        )
      );
      [
        ...(validationResult.errors || []),
        ...(validationResult.warnings || []),
      ].forEach(error => {
        console.error(red(`  * ${error}`));
      });
      console.error(red('\nPlease choose a different project name.'));
      process.exit(1);
    }
  
    // TODO: there should be a single place that holds the dependencies
    const dependencies = ['template', 'tmp'].sort();
    if (dependencies.includes(templateName)) {
      console.error(
        red(
          `Cannot create a project named ${green(
            `"${templateName}"`
          )} because a dependency with the same name exists.\n` +
            `Due to the way npm works, the following names are not allowed:\n\n`
        ) +
          cyan(dependencies.map(depName => `  ${depName}`).join('\n')) +
          red('\n\nPlease choose a different project name.')
      );
      process.exit(1);
    }
  }

export function isSafeToCreateProjectIn(root:string, name:string) {
    const validFiles = [
      '.DS_Store',
      '.git',
      '.gitattributes',
      '.gitignore',
      '.gitlab-ci.yml',
      '.hg',
      '.hgcheck',
      '.hgignore',
      '.idea',
      '.npmignore',
      '.travis.yml',
      'docs',
      'LICENSE',
      'README.md',
      'mkdocs.yml',
      'Thumbs.db',
    ];
    // These files should be allowed to remain on a failed install, but then
    // silently removed during the next create.
    const errorLogFilePatterns = [
      'npm-debug.log',
      'yarn-error.log',
      'yarn-debug.log',
    ];
    const isErrorLog = (file:string) => {
      return errorLogFilePatterns.some(pattern => file.startsWith(pattern));
    };
  
    const conflicts = fs
      .readdirSync(root)
      .filter(file => !validFiles.includes(file))
      // IntelliJ IDEA creates module files before CRA is launched
      .filter(file => !/\.iml$/.test(file))
      // Don't treat log files from previous installation as conflicts
      .filter(file => !isErrorLog(file));
  
    if (conflicts.length > 0) {
      console.log(
        `The directory ${green(name)} contains files that could conflict:`
      );
      console.log();
      for (const file of conflicts) {
        try {
          const stats = fs.lstatSync(path.join(root, file));
          if (stats.isDirectory()) {
            console.log(`  ${blue(`${file}/`)}`);
          } else {
            console.log(`  ${file}`);
          }
        } catch (e) {
          console.log(`  ${file}`);
        }
      }
      console.log();
      console.log(
        'Either try using a new directory name, or remove the files listed above.'
      );
  
      return false;
    }
  
    // Remove any log files from a previous installation.
    fs.readdirSync(root).forEach(file => {
      if (isErrorLog(file)) {
        fs.removeSync(path.join(root, file));
      }
    });
    return true;
  }

  export function validateVersion(version: string): void {
    if (!version) {
      throw new Error(`Missing extension version`);
    }
  
    if (!semver.valid(version)) {
      throw new Error(`Invalid extension version '${version}'`);
    }
  }
  