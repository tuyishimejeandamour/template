
export class ServiceCollection {

	private _entries = new Map<any, any>();

	constructor(...entries: [any, any][]) {
		for (let [id, service] of entries) {
			this.set(id, service);
		}
	}

	set(id: any, instanceOrDescriptor: any): any {
		const result = this._entries.get(id);
		this._entries.set(id, instanceOrDescriptor);
		return result;
	}

	has(id: any): boolean {
		return this._entries.has(id);
	}

	get(id: any): any {
		return this._entries.get(id);
	}
}
