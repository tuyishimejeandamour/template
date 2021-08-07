import fs from 'fs';
import { showError } from '../log/logger.platform';


export const checkExistence = (path: string): boolean => {
    return fs.existsSync(LocalPaths.CWD + path);
};

export const checkIfDirExistElseMakeDir = (hasPath: boolean, path: string): void => {
    if (hasPath) {
        let dir = checkExistence(path);
        if (!dir) {
            fs.mkdirSync(LocalPaths.CWD + path, { recursive: true });
        }
    }
}

export const fileAlreadyExist = (fileName: string): void => {
    showError(`${fileName} already exists!`);
    process.exit(1);
}