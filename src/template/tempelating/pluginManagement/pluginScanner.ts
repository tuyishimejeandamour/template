import { readdirSync, statSync } from "fs-extra";
import path from "path";
import { PLUGINLOCATION } from "../../base/env/extension.env";
import { ConsoleError } from "../../base/utils/consoleerror";
import { flatten } from "../../base/utils/function.utils";
import { Path } from "../../base/utils/path";
import { showInfo, showTrace } from "../../platform/log/logger.platform";
import { readcomposition } from "../actions/package/packageService.action";
import { IPluginContent, IPluginScanner, PluginType } from "./plugin";
const rimfs = require('../../../../resources/rim');

export class PluginScanner implements IPluginScanner {
    constructor() {
        
    }
    async scanPulgins(type?: PluginType) :Promise<IPluginContent[]>{

            const promises: Promise<IPluginContent[]>[] = [];
		    
			promises.push(this._scanAllPlugin(new Path(PLUGINLOCATION),type).then(null, e => Promise.reject(new ConsoleError({error:e.message}))));
		

		try {
			const result = await Promise.all(promises);
			return flatten(result);
		} catch (error) {
			throw console.log(error);
		}
     
    }
    private async _scanAllPlugin(pluginLocation: Path, type?: PluginType){
		const stat = readdirSync(pluginLocation.path);
		if (stat.length >0) {
			const extensions = await Promise.all(stat.filter(c => statSync(path.join(pluginLocation.path,c)).isDirectory())
				.map(c => this._scanPlugin(new Path(pluginLocation.join(c)), type)));
			return extensions.filter(e => e && e.identifier);
		}
		return [];
    }
    private async _scanPlugin(pluginLocation: Path, type?: PluginType): Promise<IPluginContent | null> {
		try {
			const stat = await statSync(pluginLocation.path);
			if (stat.isDirectory()) {
				const  manifest = await readcomposition(pluginLocation.path);
				const identifier = { id: `${manifest.publisher}.${manifest.name}`.toLocaleLowerCase()};
				const local = <IPluginContent><unknown>{ type, identifier, manifest, location: pluginLocation };
				
				return local;
			}
		} catch (e) {
			
				console.trace(e);
			
		}
		return null;
	}
    async removePulgin(extension: IPluginContent, type: PluginType): Promise<void>{
        showTrace(`Deleting ${type} extension from disk, ${extension.identifier.id},${extension.location.path}`);
		await rimfs(extension.location.path);
		showInfo(`Deleted from disk ${extension.identifier.id}, ${extension.location.path}`);

    }
}