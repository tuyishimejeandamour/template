
import { Token } from "../../base/utils/token.utils";
import { exec } from "./node.platform";


export  async function checkNPM(cancellationToken?: Token): Promise<boolean> {
     let isInstalled = false;
    const output =  await exec('npm -v',{},cancellationToken)
       const version = output.stdout.trim();
       if (version) {
         isInstalled = true
    }

     return Promise.resolve(isInstalled)
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
export function checkBOWER(cancellationToken?: Token): Promise<boolean> {
 let isInstalled = false;
   exec('bower -v', {}, cancellationToken).then(({ stdout }) => {
       const version = stdout.trim();
       if (version) {
           isInstalled = true;
       }
   }).catch(_=>{

 }
 );

return Promise.resolve(isInstalled);
}

