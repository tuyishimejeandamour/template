import path from "path";
import { exec } from "./node.platform";
import * as cp from 'child_process';
import {  existsSync } from "fs-extra";
import { showInfo } from "../log/logger.platform";
import _ from "lodash";
import { IFrameworks } from "../../base/models/store.model";
import { LocalPaths } from "../../base/env/path.env";
import { Token } from "../../base/utils/token.utils";
const parseSemver = require('parse-semver');


export interface PackageInstallOption{
	yarn:boolean,
	npm:boolean,
	bower:boolean,
	skipMessage:boolean
}


export interface IPackageDependencies{
	_resolvePackageJsonDependencies:(dependencies:any)=> Promise<{[k: string]: any}>;
	addDependencies:(dependency:any)=> Promise<any>;
	resolvePackage:(dependency:any)=>Promise<any>;
	addDevDependencies:(dependency:any)=>Promise<any>

}
function getNpmDependencies(cwd: string): Promise<string[]> {
	return Promise.resolve([LocalPaths.CWD])
}

export async function DevDependencies() {
	
	const cwd = LocalPaths.CWD
	///console.log('in function'+ cwd)
	//await  checkNPM()
	const output = await exec('npm list --dev   --loglevel=error', { cwd, maxBuffer: 5000 * 1024 })
	 return Promise.resolve(output.stdout.split(/[\r\n]/).filter(dir => dir))
		//.then(({ stdout }) => {console.log("tttt"+stdout); return });
}

interface YarnTreeNode {
	name: string;
	children: YarnTreeNode[];
}

export interface YarnDependency {
	name: string;
	path: string;
	children: YarnDependency[];
}

function asYarnDependency(prefix: string, tree: YarnTreeNode, prune: boolean): YarnDependency | null {
	if (prune && /@[\^~]/.test(tree.name)) {
		return null;
	}

	let name: string;

	try {
		const parseResult = parseSemver(tree.name);
		name = parseResult.name;
	} catch (err) {
		name = tree.name.replace(/^([^@+])@.*$/, '$1');
	}

	const dependencyPath = path.join(prefix, name);
	const children: YarnDependency[] = [];

	for (const child of tree.children || []) {
		const dep = asYarnDependency(path.join(prefix, name, 'node_modules'), child, prune);

		if (dep) {
			children.push(dep);
		}
	}

	return { name, path: dependencyPath, children };
}

function selectYarnDependencies(deps: YarnDependency[], packagedDependencies: string[]): YarnDependency[] {
	const index = new (class {
		private data: { [name: string]: YarnDependency } = Object.create(null);
		constructor() {
			for (const dep of deps) {
				if (this.data[dep.name]) {
					throw Error(`Dependency seen more than once: ${dep.name}`);
				}
				this.data[dep.name] = dep;
			}
		}
		find(name: string): YarnDependency {
			let result = this.data[name];
			if (!result) {
				throw new Error(`Could not find dependency: ${name}`);
			}
			return result;
		}
	})();

	const reached = new (class {
		values: YarnDependency[] = [];
		add(dep: YarnDependency): boolean {
			if (this.values.indexOf(dep) < 0) {
				this.values.push(dep);
				return true;
			}
			return false;
		}
	})();

	const visit = (name: string) => {
		let dep = index.find(name);
		if (!reached.add(dep)) {
			// already seen -> done
			return;
		}
		for (const child of dep.children) {
			visit(child.name);
		}
	};
	packagedDependencies.forEach(visit);
	return reached.values;
}

async function getYarnProductionDependencies(cwd: string, packagedDependencies?: string[]): Promise<YarnDependency[]> {
	const raw = await new Promise<string>((c, e) =>
		cp.exec(
			'yarn list --prod --json',
			{ cwd, encoding: 'utf8', env: { ...process.env }, maxBuffer: 5000 * 1024 },
			(err, stdout) => (err ? e(err) : c(stdout))
		)
	);
	const match = /^{"type":"tree".*$/m.exec(raw);

	if (!match || match.length !== 1) {
		throw new Error('Could not parse result of `yarn list --json`');
	}

	const usingPackagedDependencies = Array.isArray(packagedDependencies);
	const trees = JSON.parse(match[0]).data.trees as YarnTreeNode[];

	let result:YarnDependency[] = trees
		.map(tree => asYarnDependency(path.join(cwd, 'node_modules'), tree, !usingPackagedDependencies))
		.filter(dep => !!dep) as YarnDependency[];

	if (usingPackagedDependencies) {
		result = selectYarnDependencies(result, packagedDependencies as string[]);
	}

	return result as YarnDependency[];
}

async function getYarnDependencies(cwd: string, packagedDependencies?: string[]): Promise<string[]> {
	const result: string[] = [cwd];

	if (await existsSync(path.join(cwd, 'yarn.lock'))) {
		const deps = await getYarnProductionDependencies(cwd, packagedDependencies);
		const flatten = (dep: YarnDependency) => {
			result.push(dep.path);
			dep.children.forEach(flatten);
		};
		deps.forEach(flatten);
	}

	return _.uniq(result);
}

export async function detectYarn(cwd: string) {
	for (const file of ['yarn.lock', '.yarnrc']) {
		if (await existsSync(path.join(cwd, file))) {
			if (await checkYARN()) {
                
				showInfo(
					`Detected presence of ${file}. Using 'yarn' instead of 'npm' (to override this pass '--no-yarn' on the command line).`
				);
                return true;
			}
			
		}
	}
	return false;
}

export async function getDependencies(
	cwd: string,
	useYarn?: boolean,
	packagedDependencies?: string[]
): Promise<string[]> {
	return (useYarn !== undefined ? useYarn : await detectYarn(cwd))
		? await getYarnDependencies(cwd, packagedDependencies)
		: await getNpmDependencies(cwd);
}

export async function detectFramework(params:string):Promise<IFrameworks> {
	return Promise.resolve( {
		name:"react",
		version:'^17.0.2'
	}
	)
}



export  async function checkNPM(cancellationToken?: Token): Promise<boolean> {
	let isInstalled = false;
   const output =  await exec('npm -v',{},cancellationToken)
	  const version = output.stdout.trim();
	  if (version) {
		isInstalled = true
   }

	return Promise.resolve(isInstalled)
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
export function checkBOWER(cancellationToken?: Token): Promise<boolean> {
let isInstalled = false;
  exec('bower -v', {}, cancellationToken).then(({ stdout }) => {
	  const version = stdout.trim();
	  if (version) {
		  isInstalled = true;
	  }
  }).catch(_=>{

}
);

return Promise.resolve(isInstalled);
}