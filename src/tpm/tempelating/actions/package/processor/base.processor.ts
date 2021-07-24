import { IPackageTemplate } from "../../../../base/models/template.model";

export interface INonStoredFile {
	path: string;
	mode?: number;
	readonly contents: Buffer | string;
}

export interface Dependency{
    name:string;
    version:string;
}

export interface IStoreFile {
	path: string;
	mode?: number;
	readonly localPath: string;
}

export interface IAsset {
	type: string;
	path: string;
}
export type IFile = INonStoredFile | IStoreFile;

export interface IProcessor {
	onFile(file: IFile): Promise<IFile>;
	onEnd(): Promise<void | null>;
	assets: IAsset[];
	tags: string[];
	template: any;
}
export interface ITranslations {
	[key: string]: string;
}
export interface IPackageOptions {
	readonly packagePath?: string;
	readonly version?: string;
	readonly commitMessage?: string;
	readonly gitTagVersion?: boolean;
	readonly cwd?: string;
	readonly githubBranch?: string;
	readonly gitlabBranch?: string;
	readonly baseContentUrl?: string;
	readonly baseImagesUrl?: string;
	readonly useYarn?: boolean;
	readonly dependencyEntryPoints?: string[];
	readonly ignoreFile?: string;
	readonly gitHubIssueLinking?: boolean;
	readonly gitLabIssueLinking?: boolean;
}
export class BaseProcessor implements IProcessor {
    declare private _compositon:IPackageTemplate;
    declare private _assets:any[];
    declare private _templatestructure:any;
    declare private _tags:any[];
    declare private _template:any;

    constructor(composition:IPackageTemplate) {
        this._compositon = composition;
        this._assets = [];
        this._tags = [];
        this._template = Object.create(null);
    }
   
   public get template() : any {
       return this._template;
   }
   
  public set template(tem:any){
      this._template = tem;
  }
    
    public get composition() : IPackageTemplate {
        return this._compositon

    }

    public set composition(com:IPackageTemplate){
        this._compositon = com;
    }

    public get assets():any[]{
     return this._assets
    }

    public set assets(assets:any[]){
        this._assets =[...this._assets,assets]
    }
    
    
    public get tags() : string[] {
        return this._tags;
    }
    public set tags(v : string[]) {
        this._tags = [...this._tags,v]
    }
    
    
    public get templatestructure() : any {
        return  this._templatestructure
    }

    public set templatestructure(v :any) {
        this._templatestructure = v;
    }
    
    
    onFile(file: IFile): Promise<IFile> {
		return Promise.resolve(file);
	}
	onEnd() {
		return Promise.resolve();
	}
}