import { openValidateQuestion } from "../../../base/questions/open/open.question";
import { collectFiles, readcomposition } from "./packageService.action";

export const toBePublished =(cwd = process.cwd(),useYarn?: boolean,packagedDependencies?: string[]):Promise<void>=>{
    return readcomposition(cwd)
    .then(() => collectFiles(cwd, useYarn, packagedDependencies))
    .then(files => {/*files.forEach(f => console.log(`${f}`));*/console.log(files)});
}

