import { IPackageTemplate } from "template";
import { Path } from "../../base/utils/path";

export enum PulginType{
  PACKAGE,
  INSTALL
}

export interface IPlugin {
	readonly type: PulginType;
	readonly isBuiltin: boolean;
	readonly identifier: string;
	readonly manifest: IPackageTemplate;
	readonly location: Path;
}
// export interface IPulginComposition {
// 	readonly name: string;
// 	readonly displayName?: string;
// 	readonly publisher: string;
// 	readonly version: string;
// 	readonly engines: { readonly vscode: string };
// 	readonly description?: string;
// 	readonly main?: string;
// 	readonly browser?: string;
// 	readonly icon?: string;
// 	readonly categories?: string[];
// 	readonly keywords?: string[];
// 	readonly activationEvents?: string[];
// 	readonly extensionDependencies?: string[];
// 	readonly extensionPack?: string[];
// 	readonly extensionKind?: ExtensionKind | ExtensionKind[];
// 	readonly contributes?: IExtensionContributions;
// 	readonly repository?: { url: string; };
// 	readonly bugs?: { url: string; };
// 	readonly enableProposedApi?: boolean;
// 	readonly api?: string;
// 	readonly scripts?: { [key: string]: string; };
// }

export interface IPluginScanner{
    scanPulgins:(type: PulginType | null)=> Promise<IPlugin[]>;
    removeUninstalledPulgin:(extension: IPlugin)=> Promise<void>;
    removePulgin:(extension: IPlugin, type: PulginType)=> Promise<void> 

}