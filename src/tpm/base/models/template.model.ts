export interface TemplateUser {
	name: string;
	url?: string;
	email?: string;
}

export type TemplateKind = 'starter' | 'component' | 'page' | 'layout' | 'tool';

export interface TemplateSettings{
    project:string,
    framework:string,
    description:string,
    category:string,
    keyword:string,
    author:string,
    version:string,
    ignore?:string[]
    dependency?:any,
    devdependency?:any,
    structure:DirStructure[]
}

export interface DirStructure{
      name:string,
      files:any
}

export interface IPackageTemplate {
	// mandatory (npm)
	name: string;
	version: string;
	engines: { [name: string]: string };
	// template
	publisher: string;
	templateDependencies: string[];
    templateDevDependencies:string[];
	templateKind?: TemplateKind | TemplateKind[];

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