import * as cp from 'child_process';
import { Token } from '../../base/utils/token.utils';
import _read from 'read';
import denodeify from 'denodeify';
import spawn from 'execa';
import { TemplateEnviroment } from '../../base/env/template.env';


const __read = denodeify<_read.Options, string>(_read);
interface IOptions {
	cwd?: string;
	stdio?: any;
	customFds?: any;
	env?: any;
	timeout?: number;
	maxBuffer?: number;
	killSignal?: string;
}



export function exec(
	command: string,
	options: IOptions = {},
	cancellationToken?: Token
): Promise<{ stdout: string; stderr: string }> {
	return new Promise((c, e) => {
		let disposeCancellationListener: Function;

		const child = cp.exec(command, { ...options, encoding: 'utf8' } as any, (err, stdout: string, stderr: string) => {
			if (disposeCancellationListener) {
				disposeCancellationListener();
				disposeCancellationListener ;
			}

			if (err) {
				return e(err);
			}
			c({ stdout, stderr });
		});

		if (cancellationToken) {
			disposeCancellationListener = cancellationToken.subscribe((err: any) => {
				child.kill();
				e(err);
			});
		}
	});
}


  

export function read(prompt: string, options: _read.Options = {}): Promise<string> {
	if (!process.stdout.isTTY) {
		return Promise.resolve('y');
	}

	return __read({ prompt, ...options });
}


export const spawnCommand = function (command:string, args:any, opt:any) {
	return spawn(command, args, {
	  stdio: 'inherit',
	  cwd: TemplateEnviroment.templateDownLoadedDestinationRoot(),
	  ...opt
	});
  };

export const CommandAsync = (command:string,args:any,opt:any)=>{
	return spawn.sync(command, args, {
		stdio: 'inherit',
		cwd: TemplateEnviroment.templateDownLoadedDestinationRoot(),
		...opt
	  });
}
