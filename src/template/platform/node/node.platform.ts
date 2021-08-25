import * as cp from 'child_process';
import { Token } from '../../base/utils/token.utils';
import _read from 'read';
import denodeify from 'denodeify';
import spawn from 'execa';
import { TemplateEnviroment } from '../../base/env/template.env';
import { execArgv } from 'node:process';
import { assign, sanitizePath } from '../../base/utils/function.utils';
import { LocalPaths } from '../../base/env/path.env';
import { ConsoleError } from '../../base/utils/consoleerror';

export const platformexec = denodeify<string, { cwd?: string; env?: any }, { stdout: string; stderr: string }>(
	cp.exec as any,
	(err, stdout, stderr) => [err, { stdout, stderr }]
);

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
export interface SpawnOptions extends cp.SpawnOptions {
	input?: string;
	encoding?: string;
	log?: boolean;
	onSpawn?: (childProcess: cp.ChildProcess) => void;
}

export interface IExecutionResult<T extends string | Buffer> {
	exitCode: number;
	stdout: T;
	stderr: string;
}


export function execinit(
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

	return  spawn(command, args, {
	  stdio: 'inherit',
	  cwd: TemplateEnviroment.templateDownLoadedDestinationRoot(),
	  ...opt
	});
  };

export const CommandAsync = (command:string,args:any,opt?:any)=>{
	
	return spawn.sync(command, args, {
		stdio: 'inherit',
		...opt
	  });
}

export const  execPromise = async (command:string,args:any,opt?:any)=>{
   
	const output = await spawn(command,args,{...opt})

	return output
}


export async function exec(cwd: string, args: string[], options: SpawnOptions = {}): Promise<IExecutionResult<string>> {
	options = assign({ cwd }, options || {});
	return await _exec(args, options);
}
 async function  _exec(args: string[], options: SpawnOptions = {}): Promise<IExecutionResult<string>> {
	const child = fspawn(args, options);

	if (options.onSpawn) {
		options.onSpawn(child);
	}

	if (options.input) {
		child.stdin!.end(options.input, 'utf8');
	}

	const bufferResult = await fexec(child);

	if (options.log !== false && bufferResult.stderr.length > 0) {
		console.log(`${bufferResult.stderr}\n`);
	}

	const result: IExecutionResult<string> = {
		exitCode: bufferResult.exitCode,
		stdout: (bufferResult.stdout).toString(),
		stderr: bufferResult.stderr
	};

	if (bufferResult.exitCode) {
		return Promise.reject<IExecutionResult<string>>(new ConsoleError({
			message: 'Failed to execute command',
			stdout: (result.stdout).toString(),
			stderr: result.stderr,
			exitCode: result.exitCode,
			errorCode: result.stderr,
			command: args[0],
			args: args
		}));
	}

	return result;
}

function fspawn(args: string[], options: any = {}): cp.ChildProcess {
	if (!LocalPaths.CWD) {
		throw new Error('git could not be found in the system.');
	}

	if (!options) {
		options = {};
	}

	if (!options.stdio && !options.input) {
		options.stdio = ['ignore', null, null]; // Unless provided, ignore stdin and leave default streams for stdout and stderr
	}

	options.env = assign({}, process.env, options.env || {}, {
		VSCODE_GIT_COMMAND: args[0],
		LC_ALL: 'en_US.UTF-8',
		LANG: 'en_US.UTF-8',
		GIT_PAGER: 'cat'
	});

	if (options.cwd) {
		options.cwd = sanitizePath(options.cwd);
	}

	if (options.log !== false) {
		console.log(`> git ${args.join(' ')}\n`);
	}

	return cp.spawn( LocalPaths.CWD , args, options);
}

async function fexec(child: cp.ChildProcess): Promise<IExecutionResult<Buffer>> {
	if (!child.stdout || !child.stderr) {
		throw new ConsoleError({ message: 'Failed to get stdout or stderr from git process.' });
	}

	

	const once = (ee: NodeJS.EventEmitter, name: string, fn: (...args: any[]) => void) => {
		ee.once(name, fn);
	};

	const on = (ee: NodeJS.EventEmitter, name: string, fn: (...args: any[]) => void) => {
		ee.on(name, fn);
	};

	let result = Promise.all<any>([
		new Promise<number>((c, e) => {
			once(child, 'error', cpErrorHandler(e));
			once(child, 'exit', c);
		}),
		new Promise<Buffer>(c => {
			const buffers: Buffer[] = [];
			on(child.stdout!, 'data', (b: Buffer) => buffers.push(b));
			once(child.stdout!, 'close', () => c(Buffer.concat(buffers)));
		}),
		new Promise<string>(c => {
			const buffers: Buffer[] = [];
			on(child.stderr!, 'data', (b: Buffer) => buffers.push(b));
			once(child.stderr!, 'close', () => c(Buffer.concat(buffers).toString('utf8')));
		})
	]) as Promise<[number, Buffer, string]>;



	try {
		const [exitCode, stdout, stderr] = await result;
		return { exitCode, stdout, stderr };
	} finally {
		
	}
}

function cpErrorHandler(cb: (reason?: any) => void): (reason?: any) => void {
	return err => {
		if (/ENOENT/.test(err.message)) {
			err = new ConsoleError({
				error: err,
				message: 'Failed to execute command (ENOENT)',
				errorCode: 'ENOENTS'
			});
		}

		cb(err);
	};
}