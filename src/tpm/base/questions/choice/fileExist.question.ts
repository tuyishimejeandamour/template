import inquirer from 'inquirer';


export async function overwriteFileQuestion(): Promise<boolean> {
    return inquirer.prompt([{ 
        name: 'overwrite',
        type: 'confirm',
        message: 'This file already exists. Do you want to overwrite it?',
        default: false,
    }]);
}