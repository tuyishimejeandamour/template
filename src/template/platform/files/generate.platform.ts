import assert from "assert";

import  { createFileSync, existsSync, readdirSync, readFileSync, statSync, writeFile, writeFileSync} from 'fs-extra'
import path from "path";
import { Path } from "../../base/utils/path";

export interface IFileTemplateGenerator {
    copyTpl: (from: Path, to: Path, opt?: any) => void;
    copy: (from: Path, to: Path, opt: any) => void;
    write:(to:Path,content:string | Buffer)=>void;
    _copySingle: (to: Path, from:Path, content: any, opt: any) => void;
}


export class FileTemplateGenerator implements IFileTemplateGenerator {
    

    copyTpl(from: Path, to: Path, opt?: any){
        
        if(!existsSync(to.path)){
          createFileSync(to.path)
        }
        this._copySingle(to,from)
        
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

   write(to:Path,content:string | Buffer){

    this._copySingle(to,undefined,content)
   }
    _copySingle(to: Path, from?:Path, content?: any, opt?: any): void {
        let filecontent;
        if (from) {
            
            assert(existsSync(from.path), 'Trying to copy from a source that does not exist: ' + from.path);
           filecontent = readFileSync(from.path);
        }else if (content) {
            filecontent = content
        }

        if (opt) {
           
            if (opt.process) {
                
                if (from) {
                    
                    filecontent = this.applyProcessingFunc(opt.process, filecontent, from.path);
                }
            }
        }
      
       this.writeFile(to,filecontent)
    };
    private writeFile(to: Path, content: any):void {

        if (content) {
            assert(content,"seems that there is no content but we will create file")
        }
        writeFileSync(to.path,content)
        
    };

    private applyProcessingFunc(process: (arg0: any, arg1: any) => any, contents: any, filename: any) {
        var output = process(contents, filename);
        return Buffer.isBuffer(output) ? output : Buffer.from(output);
      }
}