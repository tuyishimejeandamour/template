import fs from 'fs'

import path from 'path'
import { IFrameworks, ITpmConfigSettings, Settings } from '../models/tpmSettings.model';
import { compareVersions } from '../utils/version.utils';
import { LocalPaths } from './path.env'

/**
 * class for handling all globel variables for tpm 
 */
export class TpmEnviroment implements ITpmConfigSettings{
    declare static _settingsJson:Settings;
    declare static _isUpToDate:boolean;
     constructor(){
     TpmEnviroment._settingsJson = this.loadLocalSettings();
     TpmEnviroment._isUpToDate = compareVersions(TpmEnviroment._settingsJson)
    }
    

     getversion():string{
      return TpmEnviroment._settingsJson.version
    };
    getsupportedframework():IFrameworks[] {
        return TpmEnviroment._settingsJson.supportedframeworks
    };
    
    
   loadLocalSettings():Settings{
    return JSON.parse(fs.readFileSync(path.join(LocalPaths.USERROOT,LocalPaths.TPMCONFIG,'tpm.json')).toString())
   }


}