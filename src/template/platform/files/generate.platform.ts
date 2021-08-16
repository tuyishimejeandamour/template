import assert from "assert";

import  { existsSync, readdirSync, readFileSync, statSync, writeFile} from 'fs-extra'
import path from "path";
import { Path } from "../../base/utils/path";

export interface IFileTemplateGenerator {
    copyTpl: (from: Path, to: Path, opt: any) => void;
    copy: (from: Path, to: Path, opt: any) => void;
    _copySingle: (to: Path, from:Path, content: any, opt: any) => void;
    writeFile: (to: Path, content: any) => boolean;
}


export class FileTemplateGenerator implements IFileTemplateGenerator {
    private destination: Path
    private root: Path
    constructor(destination: Path, root: Path) {
        this.destination = destination;
        this.root = root;
    }

    copyTpl(from: Path, to: Path, opt: any){

        this._copySingle(to,from,opt)
        
    };
    copy(from: Path, to: Path, opt: any) {
        if (statSync(from.path).isDirectory()) {
            readdirSync(from.path).map(name=>{
                this.copy(new Path(path.join(from.path,name)),to,opt)
            })
            
        }else(
            this._copySingle(to,from,opt)
        )
    };
    _copySingle(to: Path, from?:Path, content?: any, opt?: any): void {
        let filecontent;
        if (from) {
            
            assert(existsSync(from.path), 'Trying to copy from a source that does not exist: ' + from.path);
           filecontent = readFileSync(from.path);
        }else if (content) {
            filecontent = content
        }

        if (opt.process) {
          if (from) {
              
              filecontent = this.applyProcessingFunc(opt.process, filecontent, from.path);
          }
        }
      
       this.writeFile(to,filecontent)
    };
    writeFile(to: Path, content: any): boolean {

        writeFile(to.path, content, (err) => {

            if (err) {
                throw new Error(err.message);

            }

        })
        return true

    };

    applyProcessingFunc(process: (arg0: any, arg1: any) => any, contents: any, filename: any) {
        var output = process(contents, filename);
        return Buffer.isBuffer(output) ? output : Buffer.from(output);
      }
}