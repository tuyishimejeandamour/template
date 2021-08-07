import inquirer from "inquirer";
import { checkNPM, checkYARN, checkBOWER } from "../../../platform/node/package.platform";
import { Token } from "../../utils/token.utils";

export async function choosePackage(): Promise<string> {
    const listOfPackages = [
         {name: 'npm', value: 'npm'},
         {name: 'yarn', value:'yarn'},
         {name: 'bower', value: 'bower'},
    ];

    return inquirer.prompt([{ 
        name: 'tool',
        type: 'list',
        message: 'choose the package manager to use?',
        choices: listOfPackages,
    }]).then(answer=>answer);
}