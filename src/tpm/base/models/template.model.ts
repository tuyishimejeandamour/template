export interface TemplateUser {
	name: string;
	url?: string;
	email?: string;
}

export type TemplateKind = 'starter' | 'component' | 'page' | 'layout' | 'tool';


export interface IPackageTemplate {
	// mandatory (npm)
	name: string;
	version: string;
	framework: { version:string,name:string };
	// template
	publisher: string;
	templateDependencies: string[];
    templateDevDependencies:string[];
	templateKind?:  TemplateKind[];

	// optional (npm)
	author?: string | TemplateUser;
	displayName?: string;
	description?: string;
    markdown?: 'github' | 'standard';
	keywords?: string[];
	categories?: string[];
	homepage?: string;
	bugs?: string | { url?: string; email?: string };
	license?: string;
	contributors?: string | TemplateUser[];
	main?: string;
	repository?: string | { type?: string; url?: string };
	dependencies?: { [name: string]: string };
	devDependencies?: { [name: string]: string };
	private?: boolean;
    structure:any[]

}