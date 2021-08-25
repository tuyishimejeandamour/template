import fs from 'fs-extra'

import path from 'path'
import { Objectequals } from '../../platform/checking/types.checking';
import { load } from '../../platform/store/publisherstoreService';
import { IFrameworks, ITemplateConfigSettings, Publisher, Settings } from '../models/store.model';
import { Path } from '../utils/path';
import { LocalPaths } from './path.env'

export enum TEMPLATEGLOBALS {
    COMMAND = 'template',
    DOCURI = "https://template.com/documentation/getting-started/",
    SITE = "https://tpm.com",
    NPM = "https://registry.npmjs.org/-/package/template/dist-tags",
}

/**
 * class for handling all globel variables for tpm 
 * 
 */

/**
 * we need to intantiate this local variable in order to access all it data
 */
export class TemplateEnviroment implements ITemplateConfigSettings {
    declare static _settingsJson: Settings;
    declare static _isUpToDate: boolean;
    declare static _isnewUser: boolean;
    declare static packageuse:string;
    declare static _settingPath: string;
    private static local_settings: Settings;
    private static _currentpublisher: Publisher;
    private static _sourceRoot:Path;
    private static _destinationRoot:Path;
    declare static packageJson:any;
    declare static typeproject:string;
    declare static packageStructure:any;
    constructor() {
        this.init();
        TemplateEnviroment._settingPath = path.join(LocalPaths.HOMEDRIVE, LocalPaths.USERROOT, LocalPaths.TPMCONFIG, 'tpm.json');
        TemplateEnviroment._settingsJson = this.loadLocalSettings();
        TemplateEnviroment.local_settings = this.loadLocalSettings();
        this.getcurrentpublisher();
        //TpmEnviroment._isUpToDate = compareVersions(TpmEnviroment._settingsJson);
        TemplateEnviroment._isnewUser = TemplateEnviroment._settingsJson.isnewUser;


    }
   
    
    public set packageUse(v : string) {
        TemplateEnviroment.packageuse = v;
    }
    
    
    public get packageUse() : string {
        return  TemplateEnviroment.packageuse
    }
    

    public static get publisher(): Publisher {
        return this._currentpublisher
    }
    
    
    public static set sourceRoot(v : Path) {
        this._sourceRoot = v;
    }
    public static get sourceRoot():Path {
       return this._sourceRoot;
    }
    

    getversion(): string {
        return TemplateEnviroment._settingsJson.version
    };
    getsupportedframework(): IFrameworks[] {
        return TemplateEnviroment._settingsJson.supportedframeworks
    };
    async getcurrentpublisher() {
        TemplateEnviroment._currentpublisher = await load().then<Publisher>(store => {
            const publisher = store.publishers.filter(p => p.current)[0];
            return publisher ? Promise.resolve(publisher) : Promise.resolve(Object.create(null));
        })
    }

    loadLocalSettings(): Settings {
        return JSON.parse(fs.readFileSync(TemplateEnviroment._settingPath).toString())
    }

    static updatesettings(): void {
        if (Objectequals(TemplateEnviroment._settingsJson, TemplateEnviroment.local_settings)) {
            return;
        } else {
            const content = JSON.stringify(TemplateEnviroment._settingsJson, null, 2);
            fs.writeFileSync(TemplateEnviroment._settingPath, content)
        }
    }

    static templateDownLoadedSourceRoot(sourcePath?:any){
        if (typeof sourcePath === 'string') {
            this.sourceRoot = new Path(path.resolve(sourcePath));
          }
      
          return this.sourceRoot;
    }

    static templateDownLoadedDestinationRoot(rootPath?:Path){
        if (typeof rootPath?.path === 'string') {
            TemplateEnviroment._destinationRoot = new Path(path.resolve(rootPath.path));
      
            if (!fs.existsSync(TemplateEnviroment._destinationRoot.path)) {
              fs.mkdirSync(TemplateEnviroment._destinationRoot.path, {recursive: true});
            }
      
          }
      
          return TemplateEnviroment._destinationRoot || new Path(LocalPaths.CWD) ;
    }
     
    private init(){
        fs.mkdirpSync(path.join(LocalPaths.APPDATA,'template'))
        fs.chmodSync(path.join(LocalPaths.APPDATA,'template'),'077')
    }
}