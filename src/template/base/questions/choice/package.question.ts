import inquirer from "inquirer";

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