import * as cp from 'child_process';
import { CancellationToken } from './token.utils';

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
	cancellationToken?: CancellationToken
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
  