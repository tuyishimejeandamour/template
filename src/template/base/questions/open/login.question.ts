import inquirer from 'inquirer'
import { LoginCredentials } from '../../models/answers.model';
import { InputTypeText } from '../../models/input.model';


export const newLoginQuestion = async (): Promise<LoginCredentials> => {

    const questions: InputTypeText[] = [
        {
            name: 'username',
            type: 'input',
            message: 'Enter your TPM username or e-mail address:',
            validate: function (value) {
                if (value.length && !value.trim().includes(' ')) {
                    return true;
                } else {
                    return 'Please enter valid username or e-mail address.';
                }
            }
        },
        {
            name: 'password',
            type: 'password',
            message: 'Enter your password:',
            validate: function (value) {
                if (value.length) {
                    return true;
                } else {
                    return 'Please enter your password.';
                }
            }
        }
    ];
    return inquirer.prompt(questions);
}
