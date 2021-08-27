
import { IPluginContent } from "../../tempelating/pluginManagement/plugin";

export interface IRequest {
	readonly insert?: Map<string, IPluginContent>;
	readonly delete?: Set<string>;
}

export class ExtensionMemoryStore  {

	private readonly items = new Map<string, IPluginContent>();

	async getPlugins(): Promise<Map<string, IPluginContent>> {
		return this.items;
	}

    async getPlugin(key:string):Promise<IPluginContent>{
      return this.items.get(key) as IPluginContent
    }


	async updateItems(request: IRequest): Promise<void> {
        //assert(!isObject(request),'update request must be object');

		if (request.insert) {
			request.insert.forEach((value, key) => this.items.set(key, value));
		}

		if (request.delete) {
			request.delete.forEach(key => this.items.delete(key));
		}
	}

	async close(): Promise<void> { }
}