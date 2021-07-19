import { execSync } from 'child_process';
import https from 'https';
import { yellow } from 'kleur';
import semver from './semver';



export function checkForLatestVersion():Promise<any>{
    return new Promise((resolve, reject) => {
      https
        .get(
          'https://registry.npmjs.org/-/package/create-react-app/dist-tags',
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
        return execSync('npm view tpm version').toString().trim();
      } catch (e) {
        return null;
      }
    })
    .then(latest => {
      if (latest && semver.lt(packageJson.version, latest)) {
        console.log();
        console.error(
          yellow(
            `You are running \`create-react-app\` ${packageJson.version}, which is behind the latest release (${latest}).\n\n` +
              'We no longer support global installation of Create React App.'
          )
        );
        console.log();
        console.log(
          'Please remove any global installs with one of the following commands:\n' +
            '- npm uninstall -g create-react-app\n' +
            '- yarn global remove create-react-app'
        );
        console.log();
        console.log(
          'The latest instructions for creating a new app can be found here:\n' +
            'https://create-react-app.dev/docs/getting-started/'
        );
        console.log();
        returnvalue = false;
      } else {
        returnvalue = true
      }
    });

    return returnvalue;
}
