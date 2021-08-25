/**
 * This is the place for API experiments and proposals.
 * distribution and CANNOT be used in published extensions.
 *
 * - Copy this file to your project.
 */

declare module 'template' {

    /**
	 * The version of the template editor.
	 */
  export const version:string;

  export interface InstallFile{
    category?:string,
    from:string,
    to:string,
    readonly contents?:Buffer | string
}

  export interface IDeProcessor{
    path:string,
    composition:IPackageTemplate
    onInit:(file:InstallFile)=>Promise<InstallFile>
    onprocess:()=>Promise<void>
}

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
	templateKind:  TemplateKind;

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

}