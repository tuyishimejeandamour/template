import fs from 'fs-extra'
import path from 'path'
import { Path } from '../../base/utils/path';
import { Objectequals } from '../checking/types.checking';

export interface FileStructure{
    path:string;
    name:string;
    type?:string;
    children?:FileStructure[]
}

export const updatejsonfile = (filepath:string,old:any,newjson:any)=>{
 
    if (Objectequals(old,newjson)) {
        return;
    }else{
      const content = JSON.stringify(newjson,null,2);
      fs.writeFileSync(filepath,content)
    }

}

export const readfileExist = (path:string):any | undefined =>{
   if (fs.pathExistsSync(path)) {
    return fs.readJSONSync(path);
   }else{
       return undefined
   }
}

export const getDirectoryTree = (path:Path =new Path('./'))=>{
   if (path.path == './') {
       path.path = process.cwd();
   }

   return dirTree(path.path);
}

function dirTree(filename:string) {
    var stats = fs.lstatSync(filename),
        info:FileStructure = {
            path: filename,
            name: path.basename(filename)
        };

    if (stats.isDirectory()) {
        info.type = "folder";
        info.children = fs.readdirSync(filename).map(function(child) {
            return dirTree(filename + '/' + child);
        });
    } else {
        info.type = "file";
    }

    return info;
}

export const getFilesInDir = (path:Path)=>{

}