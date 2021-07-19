import fs from 'fs'
import path from 'path'
import { LocalPaths } from './path.env'

/**
 * class for handling all globel variables for tpm 
 */
export class TpmEnviroment{
    declare private _settingsJson:JSON;
    constructor(){
     this._settingsJson = this.loadLocalSettings();
    }
    
    /**
     * function which map the tpm global user setting to there respective values
     * @void
     */
    init():void{

    }
   loadLocalSettings():JSON{
    return JSON.parse(fs.readFileSync(path.join(LocalPaths.USERROOT,LocalPaths.TPMCONFIG,'tpm.json')).toString())
   }


}