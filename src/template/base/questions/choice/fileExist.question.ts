import inquirer from 'inquirer';


export async function overwriteFileQuestion(message?:string): Promise<any> {
    return inquirer.prompt([{ 
        name: 'overwrite',
        type: 'confirm',
        message: message || 'This file already exists. Do you want to overwrite it?',
        default: false,
    }]);
}