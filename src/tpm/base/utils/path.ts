import fs from 'fs'

export class Path {
    declare private _path:string;
    constructor(path:string){
       this.path = path;
    }
  
    set path(path:string){
     this._path = path;
    }
  
    get path(){
        return this._path;
    }
  
    get getExtension(){
        if (this.isWindowsPath) {
            return this._path.split('\\\\').pop();
        }

        return this._path.split('/').pop();
    }

    get isWindowsPath(): boolean {
      return /^[a-zA-Z]:\\/.test(this._path);
     }

    get exists(){
        const file = fs.statSync(this._path);
        if (file) {
            return true;
        }else{
            return false;
        }
    }
    toarray():string[]{
        if (this.isWindowsPath) {
            return this._path.split('\\\\');
        }
        return this._path.split('/');
    }
  }