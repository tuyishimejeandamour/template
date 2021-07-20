import fs from 'fs-extra'
import path from 'path'

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
  
    get getfilename(){
        if (fs.statSync(this._path).isDirectory()) {
            return null
        }
        if (this.isWindowsPath) {
            return this._path.split('\\\\').pop();
        }

        return this._path.split('/').pop();
    }
    get getextension(){
         
        if (fs.statSync(this._path).isDirectory()) {
            return null
        }
        if (this.isWindowsPath) {
            return this._path.split('.').pop();
        }

        return this._path.split('.').pop();
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

    join(...args:any[]){
      let joinpaths = '';
      args.forEach(arg => {
          joinpaths = path.join(joinpaths,arg);
      });

      return path.join(this.path,joinpaths);
    }
  }