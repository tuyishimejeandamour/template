import fs, { statSync } from 'fs-extra'
import path from 'path'
import { LocalPaths } from '../../base/env/path.env';
import { TemplateEnviroment } from '../../base/env/template.env';
import { Path } from '../../base/utils/path';
import { Objectequals } from '../checking/types.checking';

export interface FileStructure {
    path: string;
    name: string;
    type?: string;
    children?: FileStructure[]
}

export interface FileStruct {
    name?: string
    children?: (FileStruct | undefined)[]
}

export const updatejsonfile = (filepath: string, old: any, newjson: any) => {

    if (Objectequals(old, newjson)) {
        return;
    } else {
        const content = JSON.stringify(newjson, null, 2);
        fs.writeFileSync(filepath, content)
    }

}

export const readfileExist = (path: string): any | undefined => {
    if (fs.pathExistsSync(path)) {
        return fs.readJSONSync(path);
    } else {
        return undefined
    }
}

export const getDirectoryTree = (path: Path = new Path(LocalPaths.CWD)) => {

    return dirTree(path.path);
}

function dirTree(filename: string) {
    var stats = fs.lstatSync(filename),
        info: FileStructure = {
            path: filename,
            name: path.basename(filename)
        };

    if (stats.isDirectory()) {
        info.type = "folder";
        info.children = fs.readdirSync(filename).map(function (child) {
            return dirTree(filename + '/' + child);
        });
    } else {
        info.type = "file";
    }

    return info;
}

export const getFilesInDir = (path: Path) => {

}

export const templatePath = (...dest: any) => {
    let filepath = path.join.apply(path, dest);

    if (!path.isAbsolute(filepath)) {
        filepath = path.join(TemplateEnviroment.templateDownLoadedSourceRoot().path, filepath);
    }

    return new Path(filepath);
}

export const destinationPath = (...dest: any) => {
    let filepath = path.join.apply(path, dest);

    if (!path.isAbsolute(filepath)) {
        filepath = path.join(TemplateEnviroment.templateDownLoadedDestinationRoot().path, filepath);
    }

    return new Path(filepath);
}

const checkparent = (fil: string) => {
    if (statSync(fil).isDirectory()) {
        return true
    }

    return false
}
const returnfile = (file: string, files: string[]) => {
    const filear: string[] = [];
    const arr = new Set<string>();
    const filearray = files.map(fi => {
        if (fi.includes(file)) {
            return fi.replace(file, '').replace('/', '').split('/')[0]
        }
    })

    filearray.forEach((f) => {
        if (typeof f != 'undefined') {
            if (!arr.has(f)) {
                arr.add(f)
            }
        }

    })
    arr.forEach((val) => {
        filear.push(val)
    })

    return filear;
}
export const displayDirectory = (file: string, files: string[]) => {
    const names = file.split('/').pop();
    const stats = checkparent(file)

    const info: FileStruct = {
        name: names
    };

    if (stats) {
        info.children = returnfile(file, files).map((child) => {
            if (typeof child != 'undefined') {
                return displayDirectory(file + '/' + child.split('/')[0], files);
            }
        });
    }

    return info;
}