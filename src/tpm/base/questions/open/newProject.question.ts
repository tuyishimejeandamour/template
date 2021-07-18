import inquirer from 'inquirer';
import { NewProjectAnswer } from '../../models/answers.model';
import { InputTypeText } from '../../models/input.model';


//import { Answer, UniversalChoiceValue, Choice } from '../models/choice';

export async function newProjectQuestion(): Promise<NewProjectAnswer> {
      const question:InputTypeText[] =[
          {
            name: 'project',
            type: 'input',
            message: 'project name:',
            validate:(value)=>{
                if (value.length) {
                    return true
                }else{
                    return "project name is mandatory"
                }
            }
          },
          {
            name: 'framework',
            type: 'input',
            message: 'framework name:',
            validate:(value)=>{
                if (value.length) {
                    return true
                }else{
                    return "please provide framework name"
                }
            }
          },
          {
            name: 'description',
            type: 'input',
            message: 'description:',
            
          },
          {
            name: 'category',
            type: 'input',
            message: 'category:',
            
          },
          {
            name: 'author',
            type: 'input',
            message: 'author:',
            validate:(value)=>{
                if (value.length) {
                    return true
                }else{
                    return "please provide framework name"
                }
            }
          },
          {
            name: 'framework',
            type: 'input',
            message: 'Enter framework name:',
            validate:(value)=>{
                if (value.length) {
                    return true
                }else{
                    return "please provide framework name"
                }
            }
          },
          {
            name: 'framework',
            type: 'input',
            message: 'Enter framework name:',
            validate:(value)=>{
                if (value.length) {
                    return true
                }else{
                    return "author name is mandatory"
                }
            }
          },
          {
            name: 'version',
            type: 'input',
            message: 'version(0.0.1):',
            default:'0.0.1'
          },
          {
            name: 'license',
            type: 'input',
            message: 'license(ISC):',
            default:'ISC'
          }
    ];

    return await inquirer.prompt(question);
}
