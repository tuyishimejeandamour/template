import denodeify from "denodeify";
import path from "path";
import { IPackageTemplate } from "../../../base/models/template.model";
import * as fs from 'fs-extra';
import { cloneDeepWith } from "lodash";
import { Dependency, IFile, IPackageOptions, IPackageResult, IProcessor, ITranslations } from "./processor/base.processor";
import minimatch from "minimatch";
import { defaultignorefileandfolder, notIgnored } from "../../../base/models/ignore.model";
import { DevDependencies, getDependencies } from "../../../platform/node/dependencies.utils";
const glob = require('glob');
import * as _glob from "glob";
import { CompositionProcessor } from "./processor/composition.processor";
import _ from "lodash";
import { createDefaultProcessors } from "../../../base/loaders/instantiation.loader";
import { lookup } from "mime";
import { ReadMeProcessor } from "./processor/markdown.processor";
import { LocalPaths } from "../../../base/env/path.env";
import { writeJSONSync } from "fs-extra";
import { overwriteFileQuestion } from "../../../base/questions/choice/fileExist.question";
import { Path } from "../../../base/utils/path";
import { chain, flatten, sequenceExecuteFunction } from "../../../base/utils/function.utils";
import { openValidateQuestion } from "../../../base/questions/open/open.question";
import { TemplateEnviroment } from "../../../base/env/template.env";
import { displayDirectory } from "../../../platform/files/file.platform";
import { fileSync } from "tmp";
import { ConsoleError } from "../../../base/utils/consoleerror";
const yazl = require('yazl');
const __glob = denodeify<string, _glob.IOptions, string[]>(glob);
const readFile = denodeify<string, string, string>(fs.readFile);
const stat = denodeify(fs.stat);
const regex = /^%([\w\d.]+)%$/i;
const MinimatchOptions: minimatch.IOptions = { dot: true };
export async function listFiles(
	cwd = LocalPaths.CWD,
	useYarn?: boolean,
	packagedDependencies?: string[],
): Promise<string[]> {
	await readcomposition(cwd);
	return await getTemplateFiles(cwd, useYarn, packagedDependencies);
}
export function readcomposition(cwd = LocalPaths.CWD, nls = true): Promise<IPackageTemplate> {
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
	return (value: any) => {
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


export function collectAllTemplateFiles(cwd: string, useYarn?: boolean, dependencyEntryPoints?: string[]): Promise<string[]> {
	return getDependencies(cwd, useYarn, dependencyEntryPoints).then(deps => {
		const promises: Promise<string[]>[] = deps.map(dep => {
			return __glob('**', { cwd: dep, nodir: true, dot: true, ignore: 'node_modules/**' }).then((files: any[]) => {
				return files.map(f => path.relative(cwd, path.join(dep, f))).map(f => f.replace(/\\/g, '/'))
			});
		});

		return Promise.all(promises).then(flatten);
	});
}
export function getTemplateFiles(
	cwd: string,
	useYarn?: boolean,
	dependencyEntryPoints?: string[],
): Promise<string[]> {
	return collectAllTemplateFiles(cwd, useYarn, dependencyEntryPoints).then(files => {
		files = files.filter(f => !/\r$/m.test(f));

		return (
			readFile(path.join(cwd, '.templateignore'), 'utf8')
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
				.then(ignore => {
					if (TemplateEnviroment.typeproject == "starter") {
						return [...['**/.git/**'], ...ignore, ...notIgnored]
					}
					return [...defaultignorefileandfolder, ...ignore, ...notIgnored]

				}
				)

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

export async function getPackagePath(cwd: string, manifest: IPackageTemplate, options: IPackageOptions = {}): Promise<string> {
	if (!options.packagePath) {
		return ifdirectoryexit(path.join(cwd, getDefaultPackageName(manifest)));
	}

	try {
		const _stat = await stat(options.packagePath) as fs.Stats;

		if (_stat.isDirectory()) {
			return ifdirectoryexit(path.join(options.packagePath, getDefaultPackageName(manifest)));
		} else {
			return ifdirectoryexit(options.packagePath);
		}
	} catch {
		return ifdirectoryexit(options.packagePath);
	}
}

async function ifdirectoryexit(ppath: any) {
	const pathc = new Path(ppath);
	if (fs.existsSync(pathc.path)) {
		const ans = await overwriteFileQuestion('This package already exists. Do you want to overwrite it?');
		if (ans.overwrite) {
			return ppath;
		} else {
			const newname = "new-" + pathc.toarray()[pathc.toarray().length - 1];
			const arr = pathc.toarray();
			arr[pathc.toarray().length - 1] = newname;
			return path.resolve(arr.join('/'));
		}
	}

	return ppath;
}
function getDefaultPackageName(composition: IPackageTemplate): string {
	return `${composition.name}-${composition.version}.template`;
}

export async function pack(options: IPackageOptions = {}): Promise<IPackageResult> {
	const cwd = options.cwd || LocalPaths.CWD;

	const composition = await readcomposition(cwd);
	if (!TemplateEnviroment.typeproject) {
		TemplateEnviroment.typeproject = (await openValidateQuestion('templateking', 'input', 'provide category of template', new CompositionProcessor(composition).checktemplatekind)).templateking

	}

	const files = await gatherFileToCompress(composition, options);
	const jsFiles = files.filter(f => /\.js$/i.test(f.path));
	if (files.length > 5000 || jsFiles.length > 100) {
		console.log(
			`This extension consists of ${files.length} files, out of which ${jsFiles.length} are JavaScript files. For performance reasons, you should bundle your extension: https://aka.ms/vscode-bundle-extension . You should also exclude unnecessary files by adding them to your .vscodeignore: https://aka.ms/vscode-vscodeignore`
		);
	}

	const packagePath = await getPackagePath(cwd, composition, options);
	TemplateEnviroment.packageStructure = getDirectoryStructure(files)

	await compressTemplate(files, path.resolve(packagePath));

	return { composition, packagePath, files };
}
export function gatherFileToCompress(composition: IPackageTemplate, options: IPackageOptions = {}): Promise<IFile[]> {
	const cwd = options.cwd || LocalPaths.CWD;
	const packagedDependencies = options.dependencyEntryPoints || undefined;
	const processors = createDefaultProcessors(composition, options);

	return getTemplateFiles(cwd, options.useYarn, packagedDependencies).then(fileNames => {
		const files = fileNames.map(f => ({ path: `template/${f}`, localPath: path.join(cwd, f) }));
		return processFiles(processors, files);
	});
}

export function getDirectoryStructure(file:any) {
	const files = file.map((f:any) => {
		return new Path(f.localPath).normalize()
	})
	return displayDirectory(new Path(process.cwd()).normalize(), files)
}

function compressTemplate(files: IFile[], packagePath: string): Promise<void> {
	return denodeify<string, void>(fs.unlink as any)(packagePath)
		.catch(err => (err.code !== 'ENOENT' ? Promise.reject(err) : Promise.resolve(null)))
		.then(
			() =>
				new Promise((c, e) => {
					const zip = new yazl.ZipFile();
					files.forEach(f =>
						ReadMeProcessor.isCached(f)
							? zip.addBuffer(typeof f.contents === 'string' ? Buffer.from(f.contents, 'utf8') : f.contents, f.path, {
								mode: f.mode,
							})
							: zip.addFile(f.localPath, f.path, { mode: f.mode })
					);
					zip.end();

					const zipStream = fs.createWriteStream(packagePath);
					zip.outputStream.pipe(zipStream);

					zip.outputStream.once('error', e);
					zipStream.once('error', e);
					zipStream.once('finish', () => c());
				})
		);
}

export function processFiles(processors: IProcessor[], files: IFile[]): Promise<IFile[]> {
	const processedFiles = files.map(file => chain(file, processors, (file, processor) => processor.onFile(file)));
	return Promise.all(processedFiles).then(files => {
		return sequenceExecuteFunction(processors.map(p => () => p.onEnd())).then(() => {
			const assets = _.flatten(processors.map(p => p.assets));
			const tags = _(_.flatten(processors.map(p => p.tags)))
				.uniq() // deduplicate
				.compact() // remove falsey values
				.join(',');
			const template = processors.reduce((r, p) => ({ ...r, ...p.template }), { assets, tags });
			writeJSONSync(path.join(LocalPaths.CWD, 'template.json'), template);
			return Promise.all([totemplateXML(template), toContentTypes(files)]).then(result => {
				return [
					{ path: 'template.xml', contents: Buffer.from(result[0], 'utf8') },
					{ path: 'FIle_Types.xml', contents: Buffer.from(result[1], 'utf8') },
					...files,
				];
			});
		});
	});
}

export function totemplateXML(template: any): Promise<string> {
	const TemplateXmlPath = path.join(LocalPaths.HOMEDRIVE, LocalPaths.USERROOT, LocalPaths.TPMCONFIG, 'templatete.composition');
	return readFile(TemplateXmlPath, 'utf8')
		.then(xmlTemplateStr => _.template(xmlTemplateStr))
		.then(xmlTemplate => xmlTemplate(template));
}

const defaultExtensions = {
	'.json': 'application/json',
	'.composition': 'text/xml',
};

export function toContentTypes(files: IFile[]): Promise<string> {
	const contentTypesTemplatePath = path.join(LocalPaths.HOMEDRIVE, LocalPaths.USERROOT, LocalPaths.TPMCONFIG, '[Content_Types].xml');
	const extensions = Object.keys(_.keyBy(files, f => path.extname(f.path).toLowerCase()))
		.filter(e => !!e)
		.reduce((r, e) => ({ ...r, [e]: lookup(e) }), {});

	const allExtensions: any = { ...extensions, ...defaultExtensions };
	const contentTypes = Object.keys(allExtensions).map(extension => ({
		extension,
		contentType: allExtensions[extension],
	}));

	return readFile(contentTypesTemplatePath, 'utf8')
		.then(contentTypesTemplateStr => _.template(contentTypesTemplateStr))
		.then(contentTypesTemplate => contentTypesTemplate({ contentTypes }));
}

