import { Path } from "../../base/utils/path";

export interface IFilewrite {
	readonly overwrite?: boolean;
    readonly unlock?: boolean;
}

export interface FileDeleteOptions {

	readonly recursive: boolean;
	readonly useTrash: boolean;
}

export enum FileType {
	UNKNOWN = 0,
	FILE = 1,
	DIRECTORY = 2,
	SYMBOLICLIN = 3
}

export interface IFileStat {
	readonly type: FileType;
	readonly mtime: number;
	readonly ctime: number;
	readonly size: number;
}
export interface FileWriteOptions extends IFilewrite {
	readonly create: boolean;
}


export interface IFileService {
	stat(resource: Path): Promise<IFileStat>;
	mkdir(resource: Path): Promise<void>;
	readdir(resource: Path): Promise<[string, FileType][]>;
	delete(resource: Path, opts: FileDeleteOptions): Promise<void>;

	rename(from: Path, to: Path, opts: IFilewrite): Promise<void>;
	copy?(from: Path, to: Path, opts: IFilewrite): Promise<void>;

	readFile?(resource: Path): Promise<Uint8Array>;
	writeFile?(resource: Path, content: Uint8Array, opts: FileWriteOptions): Promise<void>;
	close?(fd: number): Promise<void>;
	read?(fd: number, pos: number, data: Uint8Array, offset: number, length: number): Promise<number>;
	write?(fd: number, pos: number, data: Uint8Array, offset: number, length: number): Promise<number>;
}

export const enum FileOperation {
	CREATE,
	DELETE,
	MOVE,
	COPY
}