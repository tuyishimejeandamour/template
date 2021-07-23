
export interface TemplateUser {
	name: string;
	url?: string;
	email?: string;
}

export interface Translation {
	id: string;
	path: string;
}

export interface Localization {
	languageId: string;
	languageName?: string;
	localizedLanguageName?: string;
	translations: Translation[];
}

export interface Contributions {
	localizations?: Localization[];
	[contributionType: string]: any;
}

export type ExtensionKind = 'ui' | 'workspace' | 'web';

export interface IPackageTemplate {
	// mandatory (npm)
	name: string;
	version: string;
	engines: { [name: string]: string };
	// template
	publisher: string;
	templateDependencies: string[];
    templateDevDependencies:string[];
	templateKind?: ExtensionKind | ExtensionKind[];

	// optional (npm)
	author?: string | TemplateUser;
	displayName?: string;
	description?: string;
	keywords?: string[];
	categories?: string[];
	homepage?: string;
	bugs?: string | { url?: string; email?: string };
	license?: string;
	contributors?: string | TemplateUser[];
	main?: string;
	browser?: string;
	repository?: string | { type?: string; url?: string };
	dependencies?: { [name: string]: string };
	devDependencies?: { [name: string]: string };
	private?: boolean;

}



// class BaseProcessor {
//     declare private _compositon:any;
//     declare private _assets:any[];
//     declare private _templatestructure:any;
//     declare private _tags:any[];
//     declare private _template:any;
//     constructor(manifest:any) {
//         this._compositon = manifest;
//         this._assets = [];
//         this._tags = [];
//         this._template = Object.create(null);
//     }
    
//     public get composition() : string {
//         return this._compositon

//     }

//     public set composition(com:any){
//         this._compositon = com;
//     }

//     public get assets():any[]{
//      return this._assets
//     }

//     public set assets(assets:any){
//         this._assets.push(assets)
//     }
    
    
//     public get templatestructure() : string {
//         return  this._templatestructure
//     }

//     public set templatestructure(v :any) {
//         this._templatestructure = v;
//     }
    
    
//     onFile(file:any) {
//         return Promise.resolve(file);
//     }
//     onEnd() {
//         return Promise.resolve(null);
//     }
// }