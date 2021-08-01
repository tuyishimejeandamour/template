import fs from 'fs'

import path from 'path'
import { Objectequals } from '../../platform/checking/types.checking';
import { load } from '../../platform/store/publisherstoreService';
import { IFrameworks, ITpmConfigSettings, Publisher, Settings } from '../models/store.model';
import { compareVersions } from '../utils/version.utils';
import { LocalPaths } from './path.env'

export enum TPMGLOBALS {
    COMMAND = 'template',
    DOCURI = "https://tpm.com/documentation/getting-started/",
    SITE = "https://tpm.com",
    NPM = "https://registry.npmjs.org/-/package/tpm/dist-tags",
}

/**
 * class for handling all globel variables for tpm 
 * 
 */

/**
 * we need to intantiate this local variable in order to access all it data
 */
export class TpmEnviroment implements ITpmConfigSettings {
    declare static _settingsJson: Settings;
    declare static _isUpToDate: boolean;
    declare static _isnewUser: boolean;
    declare static _settingPath: string;
    private static local_settings: Settings;
    private static _currentpublisher: Publisher;
    constructor() {
        TpmEnviroment._settingPath = path.join(LocalPaths.HOMEDRIVE, LocalPaths.USERROOT, LocalPaths.TPMCONFIG, 'tpm.json');
        TpmEnviroment._settingsJson = this.loadLocalSettings();
        TpmEnviroment.local_settings = this.loadLocalSettings();
        this.getcurrentpublisher();
        //TpmEnviroment._isUpToDate = compareVersions(TpmEnviroment._settingsJson);
        TpmEnviroment._isnewUser = TpmEnviroment._settingsJson.isnewUser;


    }


    public static get publisher(): Publisher {
        return this._currentpublisher
    }


    getversion(): string {
        return TpmEnviroment._settingsJson.version
    };
    getsupportedframework(): IFrameworks[] {
        return TpmEnviroment._settingsJson.supportedframeworks
    };
    async getcurrentpublisher() {
        TpmEnviroment._currentpublisher = await load().then<Publisher>(store => {
            const publisher = store.publishers.filter(p => p.current)[0];
            return publisher ? Promise.resolve(publisher) : Promise.resolve(Object.create(null));
        })
    }

    loadLocalSettings(): Settings {
        return JSON.parse(fs.readFileSync(TpmEnviroment._settingPath).toString())
    }

    static updatesettings(): void {
        if (Objectequals(TpmEnviroment._settingsJson, TpmEnviroment.local_settings)) {
            return;
        } else {
            const content = JSON.stringify(TpmEnviroment._settingsJson, null, 2);
            fs.writeFileSync(TpmEnviroment._settingPath, content)
        }
    }


}