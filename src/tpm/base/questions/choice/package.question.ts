import inquirer from "inquirer";
import { checkNPM, checkYARN, checkBOWER } from "../../../platform/node/package.platform";
import { Token } from "../../utils/token.utils";

export async function choosePackage(cancellationToken?:Token): Promise<string> {
    const listOfPackages = [
        checkNPM(cancellationToken)?{name: 'npm', value: 'npm'}:undefined,
        checkYARN(cancellationToken)?{name: 'yarn', value:'yarn'}:undefined,
        checkBOWER(cancellationToken)?{name: 'bower', value: 'bower'}:undefined,
    ];

    if (listOfPackages.length <=1) {
        return Promise.resolve('npm')
    }
    return inquirer.prompt([{ 
        name: 'tool',
        type: 'list',
        message: 'choose the package manager to use?',
        choices: listOfPackages,
    }]).then(answer=>answer);
}