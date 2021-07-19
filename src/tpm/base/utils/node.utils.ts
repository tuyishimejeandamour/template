import { spawn } from "child_process";

export function executeNodeScript({ cwd,args }:{cwd:string,args:string[]}, data:any, source:string):Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const child = spawn(
        process.execPath,
        [...args, '-e', source, '--', JSON.stringify(data)],
        { cwd, stdio: 'inherit' }
      );
  
      child.on('close', code => {
        if (code !== 0) {
          reject({
            command: `node ${args.join(' ')}`,
          });
          return;
        }
        resolve();
      });
    });
  }