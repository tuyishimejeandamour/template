import inquirer from 'inquirer';
import path from 'path';
import { LocalPaths } from '../../env/path.env';
import {  NewTemplateAnswer } from '../../models/answers.model';
import { InputTypeText } from '../../models/input.model';
const pkg  =  require(`${path.join(LocalPaths.CWD,'package.json')}`)

export async function newProjectQuestion(): Promise<NewTemplateAnswer> {
    console.log(pkg)
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
            },
            default:pkg.name
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
            default:pkg.discription
          },
          {
            name: 'category',
            type: 'input',
            message: 'category:',
            
          },
          
          {
            name: 'keyword',
            type: 'input',
            message: 'keywords:',
            
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
            message: 'version:',
            default:'0.0.1'
          }
    ];

    return await inquirer.prompt(question);
}
