import { Publisher } from "../../base/models/store.model";

export interface IStore {
	publishers: Publisher[];
}

export interface IGetOptions {
	promptToOverwrite?: boolean;
	promptIfMissing?: boolean;
}


export class Store {
    constructor() {
        
    }

    add(){
     
    }

    
}