import * as cp from 'child_process';
import { readcomposition } from '../../tempelating/actions/package/packageService.action';
import { Token } from './token.utils';
import semver from 'semver'
import _read from 'read';
import denodeify from 'denodeify';

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


  export function validateTemplateName(name:string){
    const blackListedName = [
      'template',
      '.template',
      'template.json'
    ]
    const scopedPackagePattern = new RegExp('^(?:@([^/]+?)[/])?([^/]+?)$')
    const warnings: string[] = []
    const errors = []
  
    if (name === null) {
      errors.push('name cannot be null')
      return done(warnings, errors)
    }
  
    if (name === undefined) {
      errors.push('name cannot be undefined')
      return done(warnings, errors)
    }
  
    if (typeof name !== 'string') {
      errors.push('name must be a string')
      return done(warnings, errors)
    }
  
    if (!name.length) {
      errors.push('name length must be greater than zero')
    }
  
    if (name.match(/^\./)) {
      errors.push('name cannot start with a period')
    }
  
    if (name.match(/^_/)) {
      errors.push('name cannot start with an underscore')
    }
  
    if (name.trim() !== name) {
      errors.push('name cannot contain leading or trailing spaces')
    }
  
    // No funny business
    blackListedName.forEach(function (blacklistedName) {
      if (name.toLowerCase() === blacklistedName) {
        errors.push(blacklistedName + ' is a blacklisted name')
      }
    })
  
  
    // really-long-package-names-------------------------------such--length-----many---wow
    // the thisisareallyreallylongpackagenameitshouldpublishdowenowhavealimittothelengthofpackagenames-poch.
    if (name.length > 214) {
      warnings.push('name can no longer contain more than 214 characters')
    }
  
    // mIxeD CaSe nAMEs
    if (name.toLowerCase() !== name) {
      warnings.push('name can no longer contain capital letters')
    }
  
    if (/[~'!()*]/.test(name.split('/').slice(-1)[0])) {
      warnings.push('name can no longer contain special characters ("~\'!()*")')
    }
  
    if (encodeURIComponent(name) !== name) {
      // Maybe it's a scoped package name, like @user/package
      var nameMatch = name.match(scopedPackagePattern)
      if (nameMatch) {
        var user = nameMatch[1]
        var pkg = nameMatch[2]
        if (encodeURIComponent(user) === user && encodeURIComponent(pkg) === pkg) {
          return done(warnings, errors)
        }
      }
  
      errors.push('name can only contain URL-friendly characters')
    }
  
    return done(warnings, errors)
  }

 const done = (warnings:string[], errors:string[])=>{
    var result = {
      validForNewPackages: errors.length === 0 && warnings.length === 0,
      validForOldPackages: errors.length === 0,
      warnings: warnings,
      errors: errors
    }
    // if (!result.warnings.length) delete result.warnings
    // if (!result.errors.length) delete result.errors
    return result
  }

export const  getUrl = (url: string | { url?: string } |undefined): string | null => {
    if (!url) {
      return null;
    }
  
    if (typeof url === 'string') {
      return <string>url;
    }
  
    return (<any>url).url;
  }
  
export function getRepository(url: string | { type?: string; url?: string}| undefined): string {
  let urln;
  if(url){
     urln = getUrl(url);
  }

	const result = urln ? urln:'';
  

	if (/^[^\/]+\/[^\/]+$/.test(result) && result.length>0) {
		return `https://github.com/${result}.git`;
	}

	return result;
}

export const isGitHubRepository = (repository: string): boolean=> {
	return /^https:\/\/github\.com\/|^git@github\.com:/.test(repository || '');
}
export function checkNPM(cancellationToken?: Token): Promise<void> {
	return exec('npm --v').then(({ stdout }) => {
		const version = stdout.trim();
		if (/^3\.7\.[0123]$/.test(version)) {
			return Promise.reject(`npm@${version} doesn't work with vsce. Please update npm: npm install -g npm`);
		}
	});
}
export function checkYARN(cancellationToken?: Token): Promise<boolean> {
  let isInstalled = false;
	exec('yarn -v', {}, cancellationToken).then(({ stdout }) => {
		const version = stdout.trim();

		if (version) {
			isInstalled = true;
		}
	}).catch(_=>{

  }
  );

return Promise.resolve(isInstalled);
}
export function getLatestVersion(name: string, cancellationToken?: Token): Promise<string> {
	return checkNPM(cancellationToken)
		.then(() => exec(`npm show ${name} version`, {}, cancellationToken))
		.then(parseStdout);
}

function parseStdout({ stdout }: { stdout: string }): string {
	return stdout.split(/[\r\n]/).filter(line => !!line)[0];
}

export function flatten<T>(arr:T[][]): T[] {
	return [].concat.apply([], arr as never[][]) as T[];
}
export function isGitLabRepository(repository: string): boolean {
	return /^https:\/\/gitlab\.com\/|^git@gitlab\.com:/.test(repository || '');
}


function chain2<A, B>(a: A, b: B[], fn: (a: A, b: B) => Promise<A>, index = 0): Promise<A> {
	if (index >= b.length) {
		return Promise.resolve(a);
	}

	return fn(a, b[index]).then(a => chain2(a, b, fn, index + 1));
}

export function chain<T, P>(initial: T, processors: P[], process: (a: T, b: P) => Promise<T>): Promise<T> {
	return chain2(initial, processors, process);
}

export async function sequence(promiseFactories: { (): Promise<any> }[]): Promise<void> {
	for (const factory of promiseFactories) {
		await factory();
	}
}

export function read(prompt: string, options: _read.Options = {}): Promise<string> {
	if (!process.stdout.isTTY) {
		return Promise.resolve('y');
	}

	return __read({ prompt, ...options });
}