import denodeify from "denodeify";
import path from "path";
import { IPackageTemplate } from "../../../base/models/template.model";
import * as fs from 'fs-extra';
import { cloneDeepWith } from "lodash";
import { Dependency, ITranslations } from "./processor/base.processor";
import minimatch from "minimatch";
import { defaultignorefileandfolder, notIgnored } from "../../../base/models/ignore.model";
import { getDependencies } from "../../../base/utils/dependencies.utils";
const glob = require('glob');
import * as _glob from "glob";
import { CompositionProcessor } from "./processor/composition.processor";
import { flatten } from "../../../base/utils/node.utils";
import _ from "lodash";
const __glob = denodeify<string, _glob.IOptions, string[]>(glob);
const readFile = denodeify<string, string, string>(fs.readFile);
const regex = /^%([\w\d.]+)%$/i;
const MinimatchOptions: minimatch.IOptions = { dot: true };
export async function listFiles(
	cwd = process.cwd(),
	useYarn?: boolean,
	packagedDependencies?: string[],
	ignoreFile?: string
): Promise<string[]> {
	await readcomposition(cwd);
	return await collectFiles(cwd, useYarn, packagedDependencies);
}
export function readcomposition(cwd = process.cwd(), nls = true): Promise<IPackageTemplate> {
	const manifestPath = path.join(cwd, 'package.json');
	const manifestNLSPath = path.join(cwd, 'package.nls.json');

	const manifest = readFile(manifestPath, 'utf8')
		.catch(() => Promise.reject(`Extension manifest not found: ${manifestPath}`))
		.then<IPackageTemplate>(manifestStr => {
			try {
				return Promise.resolve(JSON.parse(manifestStr));
			} catch (e) {
				return Promise.reject(`Error parsing 'package.json' manifest file: not a valid JSON file.`);
			}
		})
		.then(CompositionProcessor.validatecomposition);

	if (!nls) {
		return manifest;
	}

	const manifestNLS = readFile(manifestNLSPath, 'utf8')
		.catch<string>(err => (err.code !== 'ENOENT' ? Promise.reject(err) : Promise.resolve('{}')))
		.then<ITranslations>(raw => {
			try {
				return Promise.resolve(JSON.parse(raw));
			} catch (e) {
				return Promise.reject(`Error parsing JSON manifest translations file: ${manifestNLSPath}`);
			}
		});

	return Promise.all([manifest, manifestNLS]).then(([manifest, translations]) => {
		return mergecompositon(manifest, translations);
	});
}

function patch(translations: ITranslations): any {
    return (value:any) => {
		if (typeof value !== 'string') {
			return;
		}

		const match = regex.exec(value);

		if (!match) {
			return;
		}

		return translations[match[1]] || value;
	};
}

export function mergecompositon(manifest: IPackageTemplate, translations: ITranslations): IPackageTemplate {
	return cloneDeepWith(manifest, patch(translations)) as IPackageTemplate;
}


export function collectAllFiles(cwd: string, useYarn?: boolean, dependencyEntryPoints?: string[]): Promise<string[]> {
	return getDependencies(cwd, useYarn, dependencyEntryPoints).then(deps => {
		const promises: Promise<string[]>[] = deps.map(dep => {
			return __glob('**', { cwd: dep, nodir: true, dot: true, ignore: 'node_modules/**' }).then((files:any[]) =>
				files.map(f => path.relative(cwd, path.join(dep, f))).map(f => f.replace(/\\/g, '/'))
			);
		});

		return Promise.all(promises).then(flatten);
	});
}
export function collectFiles(
	cwd: string,
	useYarn?: boolean,
	dependencyEntryPoints?: string[],
): Promise<string[]> {
	return collectAllFiles(cwd, useYarn, dependencyEntryPoints).then(files => {
		files = files.filter(f => !/\r$/m.test(f));

		return (
			readFile(path.join(cwd, '.vscodeignore'), 'utf8')
				.catch<string>(err =>
					err.code !== 'ENOENT' ? Promise.reject(err) : Promise.resolve('')
				)

				// Parse raw ignore by splitting output into lines and filtering out empty lines and comments
				.then(rawIgnore =>
					rawIgnore
						.split(/[\n\r]/)
						.map(s => s.trim())
						.filter(s => !!s)
						.filter(i => !/^\s*#/.test(i))
				)

				// Add '/**' to possible folder names
				.then(ignore => [
					...ignore,
					...ignore.filter(i => !/(^|\/)[^/]*\*[^/]*$/.test(i)).map(i => (/\/$/.test(i) ? `${i}**` : `${i}/**`)),
				])

				// Combine with default ignore list
				.then(ignore => [...defaultignorefileandfolder, ...ignore, ...notIgnored])

				// Split into ignore and negate list
				.then(ignore => _.partition(ignore, i => !/^\s*!/.test(i)))
				.then(r => ({ ignore: r[0], negate: r[1] }))

				// Filter out files
				.then(({ ignore, negate }) =>
					files.filter(
						f =>
							!ignore.some(i => minimatch(f, i, MinimatchOptions)) ||
							negate.some(i => minimatch(f, i.substr(1), MinimatchOptions))
					)
				)
		);
	});
}

export const getDevDependencies = ():Promise<Dependency[]>=>{


	return Promise.resolve([{name:'angular',version:'^10.8.2'}])
}
export const getPeroDependencies = ():Promise<Dependency[]>=>{


	return Promise.resolve([{name:'react',version:'^17.0.2'}])
}