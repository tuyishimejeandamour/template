import { Path } from "../../base/utils/path";
import { FileDeleteOptions, FileType, IFileService, IFileStat, IFilewrite, } from "./files";



class FilesServices implements IFileService {
    constructor() {
        
    }
    stat(resource: Path): Promise<IFileStat> {
        throw new Error("Method not implemented.");
    }
    mkdir(resource: Path): Promise<void> {
        throw new Error("Method not implemented.");
    }
    readdir(resource: Path): Promise<[string, FileType][]> {
        throw new Error("Method not implemented.");
    }
    delete(resource: Path, opts: FileDeleteOptions): Promise<void> {
        throw new Error("Method not implemented.");
    }
    rename(from: Path, to: Path, opts: IFilewrite): Promise<void> {
        throw new Error("Method not implemented.");
    }
}