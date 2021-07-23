import _ from "lodash";
import { IPackageTemplate } from "../../../../base/models/template.model";
import { yesornoQuestion } from "../../../../base/questions/choice/yesorno.question";
import { getRepository, getUrl, isGitHubRepository } from "../../../../base/utils/node.utils";
import { Path } from "../../../../base/utils/path";
import { showWarn } from "../../../../platform/log/logger.util";
import { BaseProcessor, IFile, IPackageOptions } from "./base.processor";

export class ManifestProcessor extends BaseProcessor {
	constructor(composition: IPackageTemplate, options: IPackageOptions = {}) {
		super(composition);

		const flags = ['Public'];

		const repository = getRepository(composition.repository);
		const isGitHub = isGitHubRepository(repository);

		this.template = {
			...this.template,
			id: composition.name,
			displayName: composition.displayName || composition.name,
			version: composition.version,
			publisher: composition.publisher,
			framework: composition.framework,
			description: composition.description || '',
			categories: (composition.categories || []).join(','),
			flags: flags.join(' '),
			links: {
				repository,
				bugs: getUrl(composition.bugs),
				homepage: composition.homepage,
			},
			githubMarkdown: composition.markdown !== 'standard',
			templateDependencies: _(composition.templateDependencies || [])
				.uniq()
				.join(','),
			templateDevDependencies: _(composition.templateDevDependencies || [])
				.uniq()
				.join(','),
			templateKind: Array.isArray(composition.templateKind)? composition.templateKind.join(','):composition.templateKind,
			
		};

		if (isGitHub) {
			this.template.links.github = repository;
		}
	}

	async onFile(file: IFile): Promise<IFile> {
		const path = new Path(file.path).normalize();

		if (!/^extension\/package.json$/i.test(path)) {
			return Promise.resolve(file);
		}

		// Ensure that package.json is writable as VS Code needs to
		// store metadata in the extracted file.
		return { ...file, mode: 0o100644 };
	}

	async onEnd():Promise<void> {
		if (typeof this.composition.templateKind === 'string') {
			showWarn(
				`The 'templateKind' property should be of type 'string[]'`
			);
		}

		if (this.composition.publisher === 'templatepublisher') {
			throw new Error(
				"It's not allowed to use the 'templatepublisher' publisher."
			);
		}

		if (!this.composition.repository) {
			showWarn(`A 'repository' field is missing from the 'package.json' manifest file.`);

			if (!/^y$/i.test(await yesornoQuestion('Do you want to continue? [y/N] '))) {
				throw new Error('Aborted');
			}
		}
	}
    
}

