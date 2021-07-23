import {  showInfo } from './tpm/platform/log/logger.platform';
import { Token } from './tpm/base/utils/token.utils';
import { isatty } from 'tty';
import * as semver from 'semver';
import { getLatestVersion } from './tpm/base/utils/node.utils';
const pkg = require('../package.json');


export async function TEMPLATE(task:Promise<any>): Promise<any> {
    let latestVersion: string = '';

	const token = new Token();

	if (isatty(1)) {
		getLatestVersion(pkg.name, token)
			.then((version:string) => (latestVersion = version))
			.catch((_: any) => {
				/* noop */
			});
	}

	task.catch(fatal).then(() => {
		if (latestVersion && semver.gt(latestVersion, pkg.version)) {
			showInfo(
				`\nThe latest version of ${pkg.name} is ${latestVersion} and you have ${pkg.version}.\nUpdate it now: npm install -g ${pkg.name}`
			);
		} else {
			token.cancel();
		}
	});
   
}

function fatal(message: any, ...args: any[]): void {
	if (message instanceof Error) {
		message = message.message;

		if (/^cancell?ed$/i.test(message)) {
			return;
		}
	}

     console.error(message, ...args);

	if (/Unauthorized\(401\)/.test(message)) {
		console.error(`Be sure to use a Personal Access Token which has access to **all accessible accounts**.`);
	}

	process.exit(1);
}