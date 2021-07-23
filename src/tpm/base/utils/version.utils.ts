import { execSync } from 'child_process';
import https from 'https';
import { yellow } from 'kleur';
import { TPMGLOBALS } from '../env/tpm.env';
const semver  = require('./semver');



export function checkForLatestVersion():Promise<any>{
    return new Promise((resolve, reject) => {
      https
        .get(
          `${TPMGLOBALS.NPM}`,
          res => {
            if (res.statusCode === 200) {
              let body = '';
              res.on('data', data => (body += data));
              res.on('end', () => {
                resolve(JSON.parse(body).latest);
              });
            } else {
              reject();
            }
          }
        )
        .on('error', () => {
          reject();
        });
    });
  }

  export function compareVersions(packageJson:any):boolean{
    let returnvalue:boolean = true;
  checkForLatestVersion()
    .catch(() => {
      try {
        return execSync(`npm view ${TPMGLOBALS.COMMAND} version`).toString().trim();
      } catch (e) {
        return null;
      }
    })
    .then(latest => {
      if (latest && semver.lt(packageJson.version, latest)) {
        console.log();
        console.error(
          yellow(
            `You are running \`${TPMGLOBALS.COMMAND}\` ${packageJson.version}, which is behind the latest release (${latest}).\n\n` +
              'We no longer support global installation of TPM.'
          )
        );
        console.log();
        console.log(
          'Please remove any global installs with one of the following commands:\n' +
            `- npm uninstall -g ${TPMGLOBALS.COMMAND}\n` +
            `- yarn global remove ${TPMGLOBALS.COMMAND}`
        );
        console.log();
        console.log(
          'The latest instructions for creating a new app can be found here:\n' +
            `${TPMGLOBALS.DOCURI}`
        );
        console.log();
        returnvalue = false;
      } else {
        returnvalue = true
      }
    });

    return returnvalue;
}
