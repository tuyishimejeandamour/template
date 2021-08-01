import { writeJSON, writeJSONSync } from "fs-extra";
import _ from "lodash";
import path from "path";
import { TpmEnviroment } from "../../../../base/env/tpm.env";
import { IPackageTemplate, TemplateKind } from "../../../../base/models/template.model";
import { yesornoQuestion } from "../../../../base/questions/choice/yesorno.question";
import { openQuestion, openValidateQuestion } from "../../../../base/questions/open/open.question";
import { detectFramework } from "../../../../base/utils/dependencies.utils";
import { getRepository, getUrl, isGitHubRepository } from "../../../../base/utils/node.utils";
import { Path } from "../../../../base/utils/path";
import { checkTemplateName, validateVersion } from "../../../../platform/checking/template.checking";
import { showWarn } from "../../../../platform/log/logger.platform";
import { loginPublisher } from "../../../../platform/store/publisherstoreService";
import { BaseProcessor, IFile } from "./base.processor";

export class CompositionProcessor extends BaseProcessor {
	constructor(composition: IPackageTemplate) {
		super(composition);

		const flags = ['Public'];

		const repository = getRepository(composition.repository);
		const isGitHub = isGitHubRepository(repository);

		this.template = {
			...this.template,
			id: composition.name,
			displayName: composition.displayName || composition.name,
			version: composition.version,
			publisher: composition.publisher || TpmEnviroment.publisher,
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
			templateDependencies: composition.templateDependencies || [],
			templateDevDependencies: composition.templateDevDependencies || [],
			templateKind: Array.isArray(composition.templateKind) ? composition.templateKind.join(',') : composition.templateKind,

		};

		if (isGitHub) {
			this.template.links.github = repository;
		}
	}

	async onFile(file: IFile): Promise<IFile> {
		const path = new Path(file.path).normalize();

		if (!/^package.json$/i.test(path)) {
			return Promise.resolve(file);
		}

		// Ensure that package.json is writable as VS Code needs to
		// store metadata in the extracted file.
		return { ...file, mode: 0o100644 };
	}

	async onEnd(): Promise<void> {
		if (typeof this.composition.templateKind === 'string') {

			if (typeof this.checktemplatekind(this.composition.templateKind) != 'boolean') {
				const answer = await openValidateQuestion('templateking', 'input', 'provide category of template', this.checktemplatekind);
				this.composition.templateKind = [answer.templateking] as TemplateKind[];
			}

		} else {
			const answer = await openValidateQuestion('templateking', 'input', 'provide category of template', this.checktemplatekind);
			this.template = {
				...this.template,
				templateKind: [answer.templateking] as TemplateKind[]
			}
			this.composition.templateKind = [answer.templateking] as TemplateKind[];
		}

		if (!this.composition.framework) {
			const answer = await openQuestion('framework', 'input', 'provide framework');
			const framework = await detectFramework(answer.framework);
			this.template = {
				...this.template,
				framework: framework
			};
		}

		if (!this.composition.repository) {
			showWarn(`A 'repository' field is missing from the 'package.json'  file.`);
			const res = await yesornoQuestion('Do you want to provide one? [y/N] ');
			if (/^y$/i.test(res.yesorno)) {

				const repo = await openQuestion('repository', 'input', "insert repository :");
				this.template.links.repository = getRepository(repo.repository);
			}
		}

		if (!this.template.publisher) {
			showWarn(`'publisher' field is missing`);
			const repo = await openQuestion('publisher', 'input', "publisher name :");
			this.template.publisher = await loginPublisher(repo.publisher);

		}

		writeJSONSync(path.join(process.cwd(), 'template.json'), this.template)
	}
	static validatecomposition(composition: IPackageTemplate): IPackageTemplate {
		checkTemplateName(composition.name);

		if (!composition.version) {
			throw new Error('Manifest missing field: version');
		}

		validateVersion(composition.version);


		return composition;
	}
	private checktemplatekind(kind: string) {
		const categories = ['starter', 'component', 'page', 'layout', 'tool']
		const n = categories.findIndex(element => element == kind);
		if (n > -1) {
			return true
		} else {
			return `provide valid category:('starter' , 'component' , 'page' , 'layout' , 'tool')`;
		}

	}
}


