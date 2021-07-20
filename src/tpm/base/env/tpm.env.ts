import fs from 'fs'

import path from 'path'
import { Objectequals } from '../../platform/checking/types.checking';
import { IFrameworks, ITpmConfigSettings, Settings } from '../models/tpmSettings.model';
import { compareVersions } from '../utils/version.utils';
import { LocalPaths } from './path.env'

export enum TPMGLOBALS{
    COMMAND='template',
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
    private static local_settings:Settings;
     constructor(){
     TpmEnviroment._settingPath = path.join(LocalPaths.HOMEDRIVE,LocalPaths.USERROOT,LocalPaths.TPMCONFIG,'tpm.json');
     TpmEnviroment._settingsJson = this.loadLocalSettings();
     TpmEnviroment.local_settings = this.loadLocalSettings();
     //TpmEnviroment._isUpToDate = compareVersions(TpmEnviroment._settingsJson);
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
   
   static updatesettings():void{
       if (Objectequals(TpmEnviroment._settingsJson,TpmEnviroment.local_settings)) {
           return;
       }else{
         const content = JSON.stringify(TpmEnviroment._settingsJson,null,2);
         fs.writeFileSync(TpmEnviroment._settingPath,content)
       }
   }
   

}