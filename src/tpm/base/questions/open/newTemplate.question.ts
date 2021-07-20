import inquirer from 'inquirer';
import {  NewTemplateAnswer } from '../../models/answers.model';
import { InputTypeText } from '../../models/input.model';

export async function newProjectQuestion(): Promise<NewTemplateAnswer> {
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
          }
    ];

    return await inquirer.prompt(question);
}
