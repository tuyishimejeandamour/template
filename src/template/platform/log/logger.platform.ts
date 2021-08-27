import { red, green, cyan, yellow, blue, bgCyan } from 'kleur';
import * as figlet from 'figlet';
import { ConsoleMessage } from '../../base/models/message.model';
import { TemplateEnviroment } from '../../base/env/template.env';
import { clear, log } from 'node:console';


const newLine = '\n';

export const showTitleAndBanner = (val:boolean = false): void => {
    if (!val) {
    if(TemplateEnviroment._isnewUser){
        TemplateEnviroment._settingsJson.isnewUser = false;
        TemplateEnviroment.updatesettings()
    }else{
        return;
    }
    }
        console.log(cyan(figlet.textSync(ConsoleMessage.TITLE, { horizontalLayout: 'full' })));
        console.info(cyan(ConsoleMessage.BANNER));
    
   
}

export const showError = (message: string | Error): void => {
    console.error(red(`🛑 `+ConsoleMessage.ERROR) + message);
}

export const showSuccess = (message: string): void => {
    console.info(green(`✔︎ `+ConsoleMessage.SUCCESS) + message + newLine);
}

export const showInfo = (message: string): void => {
    console.info(cyan( `ℹ`+ConsoleMessage.INFO) + message + newLine);
}
export const showWarn = (message: string): void => {
    console.warn(yellow(`⚠️ `+ConsoleMessage.INFO) + message + newLine);
}

export const showGenerate = (fileName: string): void => {
    console.log(cyan(ConsoleMessage.GENERATE) + `${fileName}...`);
}

export const showCreate = (fileName: string, filePath: string): void => {
    filePath
    ? console.log(green(ConsoleMessage.CREATE) + `${fileName} in ${filePath}`)
    : console.log(green(ConsoleMessage.CREATE) + `${fileName}`);
}

export const creatingFile = (message:string)=>{
    console.info(cyan( `⚡ `+message ));

}

export const showTrace = (message:string)=>{
    console.log(`\x1b${bgCyan('[ '+ new Date().toISOString()+']\x1b[0m')}`, message)
}

export const showUpdate = (fileName: string, filePath: string): void => {
    filePath
    ? console.log(green(ConsoleMessage.UPDATE) + `${fileName} in ${filePath}`)
    : console.log(green(ConsoleMessage.UPDATE) + `${fileName}`);
}

export const usage = ():void =>{
    console.log(`
    TPM helps you get template into your project.
  
    usage:
      ${yellow('tpm')} <command>
  
      ${blue('commands can be')}:
  
      new:      used to create a new tpm template project
      create:   used to create  template form existing project
      help:     used to print the usage guide
      info:     used to provide all info of tpm application on your server

      ${blue('other')}:
       
      usage:
      ${yellow('tpm')} new <command>
      
      template: used by default when new command used
      extension:used to create extension for tpm
    
    
    `)
}