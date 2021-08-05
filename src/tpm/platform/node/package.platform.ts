import { Token } from "../../base/utils/token.utils";
import { exec } from "./node.platform";

export  async function checkNPM(cancellationToken?: Token): Promise<void> {
    const output =  await exec('npm -v',{},cancellationToken)
       const version = output.stdout.trim();
       if (/^3\.7\.[0123]$/.test(version)) {
           return Promise.reject(`npm@${version} doesn't work with vsce. Please update npm: npm install -g npm`);
       }
     return Promise.resolve()
}
export function checkYARN(cancellationToken?: Token): Promise<boolean> {
 let isInstalled = false;
   exec('yarn -v', {}, cancellationToken).then(({ stdout }) => {
       const version = stdout.trim();

       if (version) {
           isInstalled = true;
       }
   }).catch(_=>{

 }
 );

return Promise.resolve(isInstalled);
}