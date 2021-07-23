import * as cp from 'child_process';
import { Token } from './token.utils';

interface IOptions {
	cwd?: string;
	stdio?: any;
	customFds?: any;
	env?: any;
	timeout?: number;
	maxBuffer?: number;
	killSignal?: string;
}



function exec(
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
function checkNPM(cancellationToken?: Token): Promise<void> {
	return exec('npm -v', {}, cancellationToken).then(({ stdout }) => {
		const version = stdout.trim();

		if (/^3\.7\.[0123]$/.test(version)) {
			return Promise.reject(`npm@${version} doesn't work with vsce. Please update npm: npm install -g npm`);
		}
	});
}
export function getLatestVersion(name: string, cancellationToken?: Token): Promise<string> {
	return checkNPM(cancellationToken)
		.then(() => exec(`npm show ${name} version`, {}, cancellationToken))
		.then(parseStdout);
}

function parseStdout({ stdout }: { stdout: string }): string {
	return stdout.split(/[\r\n]/).filter(line => !!line)[0];
}
