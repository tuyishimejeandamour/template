import fs from 'fs'

import path from 'path'
import { Objectequals } from '../../platform/checking/types.checking';
import { IFrameworks, ITpmConfigSettings, Settings } from '../models/tpmSettings.model';
import { compareVersions } from '../utils/version.utils';
import { LocalPaths } from './path.env'

const pathsettings =path.join(LocalPaths.USERROOT,LocalPaths.TPMCONFIG,'tpm.json');
export enum TPMGLOBALS{
    COMMAND='tpm',
    DOCURI="https://tpm.com/documentation/getting-started/",
    SITE="https://tpm.com",
    NPM="https://registry.npmjs.org/-/package/tpm/dist-tags",
}
/**
 * class for handling all globel variables for tpm 
 */
export class TpmEnviroment implements ITpmConfigSettings{
    declare static _settingsJson:Settings;
    declare static _isUpToDate:boolean;
    declare static _isnewUser:boolean;
    declare static _settingPath:string;
     constructor(){
     TpmEnviroment._settingsJson = this.loadLocalSettings();
     TpmEnviroment._isUpToDate = compareVersions(TpmEnviroment._settingsJson);
     TpmEnviroment._isnewUser = TpmEnviroment._settingsJson.isnewUser;
     TpmEnviroment._settingPath = path.join(LocalPaths.USERROOT,LocalPaths.TPMCONFIG,'tpm.json');
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

         fs.writeFile(TpmEnviroment._settingPath,content)
       }
   }

}