import path from "path";
import { IPackageTemplate } from "template";
import { PLUGINLOCATION } from "../../base/env/extension.env";
import { LocalPaths } from "../../base/env/path.env";
import { generateid } from "../../base/utils/id.util";
import { Path } from "../../base/utils/path";
import { buffer } from "../../base/utils/zip";
import { EDownload, IDownload } from "../../platform/download/download";
import { FileTemplateGenerator } from "../../platform/files/generate.platform";
import { showError, showInfo } from "../../platform/log/logger.platform";
import { IPluginContent, IPluginScanner, IPluginService, Plugin, PluginType } from "./plugin";

export class PluginService implements IPluginService {
	constructor(
		private downloadService: IDownload,
		private pluginScanning: IPluginScanner
	) {

	}
	async getComposition(template: Path): Promise<IPackageTemplate> {
		const downloadLocation = await this.downloadPlugin(template);
		const zipPath = path.resolve(downloadLocation.path);
		return this._getCompositon(path.join(zipPath, 'package.json'));
	}
	async install(template: Path): Promise<IPluginContent> {
		const downloadLocation = await this.downloadPlugin(template);
		const downloadPath = new Path(path.resolve(downloadLocation.path));

		const manifest = await this.getComposition(downloadPath);
		const identifier = { id: this.getPluginId(manifest.publisher, manifest.name) };
		if (manifest.templateEngine) {
			throw new Error(`Unable to install extension '${identifier.id}' as it is not compatible with template '`);
		}

		const pluginIdVerison = new Plugin(identifier, manifest.version);
		const installedExtensions = await this.getInstalled(PluginType.INSTALL);
		const existing = installedExtensions.find(i => PluginService.areSame(identifier, { id: i.identifier }));
		if (existing) {
			if (pluginIdVerison.equals(new Plugin(existing.identifier, existing.manifest.version))) {
				try {
					await this.pluginScanning.removePulgin(existing, existing.type);
				} catch (e) {
					throw new Error("Error while intalling plugin");
				}

			}

			showInfo(`Installing the extension:', ${identifier.id}`);

			try {
				const local = await this.installFromTempFolder(pluginIdVerison, downloadPath);
				showInfo(`Successfully installed the extension:', ${identifier.id}`);
				return Promise.resolve(local);
			} catch (e) {
				showError(`Failed to install the extension:\n${identifier.id}\n ${e.message}`);
				throw e;
			}

		}

		return Promise.resolve(Object.create(null))
	}
	installFromTempFolder(plugin: Plugin, pluginpath: Path): Promise<IPluginContent> {
		const fileService = new  FileTemplateGenerator()
		const folderName = plugin.key();
		const newDirectoryPluginPath = new Path(path.join(PLUGINLOCATION, folderName));
		try {
			
			fileService.copy(pluginpath,newDirectoryPluginPath)
		} catch (error) {
			throw new Error("error while trying to install");
			
		}
        
		return this.getInstalled(PluginType.INSTALL).then((plugin)=>{
		
			return plugin.find((pl)=>{
              if (pl.location.path == newDirectoryPluginPath.path) {
				  return pl
			  }
			})as IPluginContent
			
		})

	}
	uninstall(extension: IPluginContent): Promise<void> {
		throw new Error("Method not implemented.");
	}
	getInstalled(type?: PluginType): Promise<IPluginContent[]> {
		return this.pluginScanning.scanPulgins(type)
	}

	private async downloadPlugin(template: any): Promise<Path> {
		if (path.isAbsolute(template)) {
			return template;
		}
		if (!this.downloadService) {
			throw new Error('Download service is not available');
		}

		const downloadedLocation = path.join(LocalPaths.TEMP, generateid());
		await this.downloadService.download(template, EDownload.EXTENISON, downloadedLocation);
		return new Path(downloadedLocation);
	}

	private _getCompositon(fspath: string) {
		return buffer(fspath, 'plugin/template.json')
			.then(buffer => {
				try {
					return JSON.parse(buffer.toString('utf8'));
				} catch (err) {
					throw new Error("template.json is not a JSON file.");
				}
			});

	}

	private getPluginId(publisher: string, name: string) {
		return `${publisher}.${name}`.toLocaleLowerCase()
	}

	static areSame(a: { id: any; }, b: { id: any; }) {
		if (a.id === b.id) {
			return true
		}
		return false

	}
}


