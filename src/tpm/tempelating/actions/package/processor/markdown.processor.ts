
import denodeify from "denodeify";
import  fs  from "fs-extra";
import { IPackageTemplate } from "../../../../base/models/template.model";
import { isGitHubRepository, isGitLabRepository } from "../../../../base/utils/node.utils";
import { Path } from "../../../../base/utils/path";
import { BaseProcessor, IFile, INonStoredFile, IPackageOptions } from "./base.processor";
import markdownit from 'markdown-it';
import * as cheerio from 'cheerio';
import * as url from 'url';
const  urljoin  = require('url-join');
const readFile = denodeify<string, string, string>(fs.readFile);

export class ReadMeProcessor extends BaseProcessor {
	private baseContentUrl: string;
	private baseImagesUrl: string;
	private isGitHub: boolean;
	private isGitLab: boolean;
	private repositoryUrl: string;
	private gitHubIssueLinking: boolean;
	private gitLabIssueLinking: boolean;
	private name: string = 'README.md';
	private regexp: RegExp = /^template\/readme.md$/i;
	private assetType: string = "console.assest"

	constructor(
		composition: IPackageTemplate,
		options: IPackageOptions = {}
	) {
		super(composition);

		const guess = this.guessBaseUrls(options.githubBranch || options.gitlabBranch);

		this.baseContentUrl = (options.baseContentUrl || (guess && guess.content)) as string;
		this.baseImagesUrl = (options.baseImagesUrl || options.baseContentUrl || (guess && guess.images)) as string;
		this.repositoryUrl = (guess && guess.repository) as string;
		this.isGitHub = isGitHubRepository(this.repositoryUrl);
		this.isGitLab = isGitLabRepository(this.repositoryUrl);
		this.gitHubIssueLinking =  true;
		this.gitLabIssueLinking = true;
	}

	async onFile(file: IFile): Promise<IFile> {
		const path = new Path(file.path).normalize();

		if (!this.regexp.test(path)) {
			return Promise.resolve(file);
		}

		this.assets.push({ type: this.assetType, path });

		let contents = await ReadMeProcessor.read(file);

		if (/This is the README for your extension /.test(contents)) {
			throw new Error(`Make sure to edit the README.md file before you package or publish your extension.`);
		}

		const markdownPathRegex = /(!?)\[([^\]\[]*|!\[[^\]\[]*]\([^\)]+\))\]\(([^\)]+)\)/g;
		const urlReplace = (_: any, isImage: any, title: string, link: string) => {
			if (/^mailto:/i.test(link)) {
				return `${isImage}[${title}](${link})`;
			}

			const isLinkRelative = !/^\w+:\/\//.test(link) && link[0] !== '#';

			if (!this.baseContentUrl && !this.baseImagesUrl) {
				const asset = isImage ? 'image' : 'link';

				if (isLinkRelative) {
					throw new Error(
						`Couldn't detect the repository where this extension is published. The ${asset} '${link}' will be broken in ${this.name}. GitHub/GitLab repositories will be automatically detected. Otherwise, please provide the repository URL in package.json`
					);
				}
			}

			title = title.replace(markdownPathRegex, urlReplace);
			const prefix = isImage ? this.baseImagesUrl : this.baseContentUrl;

			if (!prefix || !isLinkRelative) {
				return `${isImage}[${title}](${link})`;
			}

			return `${isImage}[${title}](${urljoin(prefix, link)})`;
		};

		// Replace Markdown links with urls
		contents = contents.replace(markdownPathRegex, urlReplace);

		// Replace <img> links with urls
		contents = contents.replace(/<img.+?src=["']([/.\w\s-]+)['"].*?>/g, (all, link) => {
			const isLinkRelative = !/^\w+:\/\//.test(link) && link[0] !== '#';

			if (!this.baseImagesUrl && isLinkRelative) {
				throw new Error(
					`Couldn't detect the repository where this extension is published. The image will be broken in ${this.name}. GitHub/GitLab repositories will be automatically detected. Otherwise, please provide the repository URL in package.json or use the --baseContentUrl and --baseImagesUrl options.`
				);
			}
			const prefix = this.baseImagesUrl;

			if (!prefix || !isLinkRelative) {
				return all;
			}

			return all.replace(link, urljoin(prefix, link));
		});

		if ((this.gitHubIssueLinking && this.isGitHub) || (this.gitLabIssueLinking && this.isGitLab)) {
			const markdownIssueRegex = /(\s|\n)([\w\d_-]+\/[\w\d_-]+)?#(\d+)\b/g;
			const issueReplace = (
				all: string,
				prefix: string,
				ownerAndRepositoryName: string,
				issueNumber: string
			): string => {
				let result = all;
				let owner: string ='';
				let repositoryName: string='';

				if (ownerAndRepositoryName) {
					[owner, repositoryName] = ownerAndRepositoryName.split('/', 2);
				}

				if (owner && repositoryName && issueNumber) {
					// Issue in external repository
					const issueUrl = this.isGitHub
						? urljoin('https://github.com', owner, repositoryName, 'issues', issueNumber)
						: urljoin('https://gitlab.com', owner, repositoryName, '-', 'issues', issueNumber);
					result = prefix + `[${owner}/${repositoryName}#${issueNumber}](${issueUrl})`;
				} else if (!owner && !repositoryName && issueNumber) {
					// Issue in own repository
					result =
						prefix +
						`[#${issueNumber}](${
							this.isGitHub
								? urljoin(this.repositoryUrl, 'issues', issueNumber)
								: urljoin(this.repositoryUrl, '-', 'issues', issueNumber)
						})`;
				}

				return result;
			};
			// Replace Markdown issue references with urls
			contents = contents.replace(markdownIssueRegex, issueReplace);
		}

		const html = markdownit({ html: true }).render(contents);
		const $ = cheerio.load(html);

		$('img').each((_, img) => {

			const src = decodeURI($(img).attr('src') as string);
			const srcUrl = url.parse(src);

			if (/^data:$/i.test(srcUrl.protocol as string) && /^image$/i.test(srcUrl.host as string) && /\/svg/i.test(srcUrl.path as string)) {
				throw new Error(`SVG data URLs are not allowed in ${this.name}: ${src}`);
			}
		});

		$('svg').each(() => {
			throw new Error(`SVG tags are not allowed in ${this.name}.`);
		});

		return {
			path: file.path,
			contents: Buffer.from(contents, 'utf8'),
		};
	}

	// GitHub heuristics
	private guessBaseUrls(githostBranch: string | undefined): { content: string; images: string; repository: string } | null {
		let repository = null;

		if (typeof this.composition.repository === 'string') {
			repository = this.composition.repository;
		} else if (this.composition.repository && typeof this.composition.repository['url'] === 'string') {
			repository = this.composition.repository['url'];
		}

		if (!repository) {
			return null;
		}

		const gitHubRegex = /(?<domain>github(\.com\/|:))(?<project>(?:[^/]+)\/(?:[^/]+))(\/|$)/;
		const gitLabRegex = /(?<domain>gitlab(\.com\/|:))(?<project>(?:[^/]+)(\/(?:[^/]+))+)(\/|$)/;
		const match = ((gitHubRegex.exec(repository) || gitLabRegex.exec(repository)) as unknown) as {
			groups: Record<string, string>;
		};

		if (!match) {
			return null;
		}

		const project = match.groups.project.replace(/\.git$/i, '');
		const branchName = githostBranch ? githostBranch : 'HEAD';

		if (/^github/.test(match.groups.domain)) {
			return {
				content: `https://github.com/${project}/blob/${branchName}`,
				images: `https://github.com/${project}/raw/${branchName}`,
				repository: `https://github.com/${project}`,
			};
		} else if (/^gitlab/.test(match.groups.domain)) {
			return {
				content: `https://gitlab.com/${project}/-/blob/${branchName}`,
				images: `https://gitlab.com/${project}/-/raw/${branchName}`,
				repository: `https://gitlab.com/${project}`,
			};
		}

		return null;
	}

   
     static isCached(file: IFile): file is INonStoredFile {
        return !!(file as INonStoredFile).contents;
    }
    
      static read(file: IFile): Promise<string> {
        if (this.isCached(file)) {
            return Promise.resolve(file.contents).then(b => (typeof b === 'string' ? b : b.toString('utf8')));
        } else {
            return readFile(file.localPath, 'utf8');
        }
    }
}
