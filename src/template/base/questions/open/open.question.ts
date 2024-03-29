import inquirer from 'inquirer'



export const openQuestion = async (name:string,type:string,message:string): Promise<any> => {

    const questions =[ 
        {
            name: name,
            type: type,
            message: message,
            
        }
    ]
    return inquirer.prompt(questions);
}
export const openValidateQuestion = async (name:string,type:string,message:string,fn:(value:string)=>any): Promise<any> => {

    const questions =[ 
        {
            name: name,
            type: type,
            message: message,
            validate: fn
        }
    ]
    return inquirer.prompt(questions);
}
