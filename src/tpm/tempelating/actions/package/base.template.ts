



class BaseProcessor {
    declare private _compositon:any;
    declare private _assets:any[];
    declare private _tags:any[];
    declare private _template:any;
    constructor(manifest:any) {
        this._compositon = manifest;
        this._assets = [];
        this._tags = [];
        this._template = Object.create(null);
    }
    
    public get composition() : string {
        return this._compositon

    }

    public set composition(com:any){
        this._compositon = com;
    }

    public get assets():any[]{
     return this._assets
    }

    public set assets(assets:any){
        this._assets = assets
    }
    
    onFile(file:any) {
        return Promise.resolve(file);
    }
    onEnd() {
        return Promise.resolve(null);
    }
}