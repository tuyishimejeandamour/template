import fs from 'fs'

import path from 'path'
import { Objectequals } from '../../platform/checking/types.checking';
import { IFrameworks, ITpmConfigSettings, Settings } from '../models/tpmSettings.model';
import { compareVersions } from '../utils/version.utils';
import { LocalPaths } from './path.env'

export enum TPMGLOBALS{
    COMMAND='tpm',
    DOCURI="https://tpm.com/documentation/getting-started/",
    SITE="https://tpm.com",
    NPM="https://registry.npmjs.org/-/package/tpm/dist-tags",
}

/**
 * class for handling all globel variables for tpm 
 * 
 */

/**
 * we need to intantiate this local variable in order to access all it data
 */
export class TpmEnviroment implements ITpmConfigSettings{
    declare static _settingsJson:Settings;
    declare static _isUpToDate:boolean;
    declare static _isnewUser:boolean;
    declare static _settingPath:string;
     constructor(){
     TpmEnviroment._settingPath = path.join(LocalPaths.HOMEDRIVE,LocalPaths.USERROOT,LocalPaths.TPMCONFIG,'tpm.json');
     TpmEnviroment._settingsJson = this.loadLocalSettings();
     TpmEnviroment._isUpToDate = compareVersions(TpmEnviroment._settingsJson);
     TpmEnviroment._isnewUser = TpmEnviroment._settingsJson.isnewUser;
    
    }
    

     getversion():string{
      return TpmEnviroment._settingsJson.version
    };
    getsupportedframework():IFrameworks[] {
        return TpmEnviroment._settingsJson.supportedframeworks
    };
    
    
   loadLocalSettings():Settings{
    return JSON.parse(fs.readFileSync(TpmEnviroment._settingPath).toString())
   }
   
   updatesettings():void{
       if (Objectequals(TpmEnviroment._settingsJson,this.loadLocalSettings())) {
           return;
       }else{
         const content = JSON.stringify(TpmEnviroment._settingsJson,null,2);

         fs.writeFile(TpmEnviroment._settingPath,content,(error:any)=>{
             throw new Error(error.message); 
         })
       }
   }

}