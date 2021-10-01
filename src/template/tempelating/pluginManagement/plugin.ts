import { IPackageTemplate } from "template";
import { Path } from "../../base/utils/path";
import { PluginService } from "./pluginservice";

export enum PluginType{
  PACKAGE,
  INSTALL
}
export interface Id{
	id:string
}
export interface IPluginContent {
	readonly type: PluginType;
	readonly identifier: Id;
	readonly manifest: IPackageTemplate;
	readonly location: Path;
}

export interface IPlugin{
	id: string;
	version: string;
}

export interface IPluginScanner{
    scanPulgins:(type?: PluginType)=> Promise<IPluginContent[]>;
    removeUninstalledPulgin:(extension: IPluginContent)=> Promise<void>;
    removePulgin:(extension: IPluginContent, type: PluginType)=> Promise<void>;

}

export interface IPluginService{
	getComposition(template: Path): Promise<IPackageTemplate>;
	install(template: Path): Promise<IPluginContent>;
	uninstall(extension: IPluginContent): Promise<void>;
	getInstalled(type?: PluginType): Promise<IPluginContent[]>;
}

export interface IPluginInstallOption{
	global:boolean,
	save:boolean
}
export class Plugin implements IPlugin {
	readonly id: string;

	constructor(
		identifier: {id:string},
		readonly version: string
	) {
		this.id = identifier.id;
	}

	key(): string {
		return `${this.id}-${this.version}`;
	}

	equals(o: Plugin): boolean {
		return PluginService.areSame(this, o) && this.version === o.version;
	}
}