import inquirer from 'inquirer';


export async function yesornoQuestion(message:string): Promise<any> {
    return inquirer.prompt([{ 
        name: 'yesorno',
        type: 'input',
        message: message,
        default: 'no',
    }]);
}