import path from "path";
import { LocalPaths } from "../../base/env/path.env";
import * as https from 'https';
import { createGunzip } from 'zlib';
import * as http from 'http'
import { parse as parseUrl } from 'url';
import { Path } from "../../base/utils/path";
import { FileTemplateGenerator } from "../files/generate.platform";

export enum EDownload{
  EXTENISON,
  TEMPLATE
}

export interface IHeaders {
	[header: string]: string;
}
export interface IRequest {
	res: {
		headers: IHeaders;
		statusCode?: number;
	};
	stream: Buffer;

}

export interface IRequestOption{
    type?: string;
	url?: string;
	user?: string;
	password?: string;
	headers?: IHeaders;
	data?: string;
}

export interface IDownloadOption{
  templatePath?:Path ,
  extensionDownloadPath?:Path,
}
export interface IDownload {

	download(pack:string,type:EDownload,location?:string): Promise<string>;
    request(opt:IRequestOption):Promise<IRequest>,

}

export class Download implements IDownload {
    private  fileService = new FileTemplateGenerator()
	constructor(
     private option:IDownloadOption
	) { }

	async download(resource:string,type:EDownload,location?:string): Promise<string> {

		if (type === EDownload.EXTENISON) {
			const {res}= await this.downloadExtension(resource);
			this.fileService.write(new Path(location as string), res.stream);
            return this.unzipTemplate(new Path(location as string))

		}
		const {context,tempname} = await this.downloadTemplate(resource);
		if (context.res.statusCode === 200 && this.option.templatePath ) {
            const downloadpath= new Path(this.option.templatePath.join(tempname));
			this.fileService.write(downloadpath, context.stream);
            return this.unzipTemplate(downloadpath)
		} else {
			throw new Error(`Expected 200, got back ${context.res.statusCode} instead.`);
		}
	}

  async  downloadExtension(name:string):Promise<{res:IRequest}> {
    return Object.create(null)
  }

  async downloadTemplate(templateName:string):Promise<{context:IRequest,tempname:string}>{

    if (typeof templateName == 'string') {

    }
    return Object.create(null)

  }

  async request(options:IRequestOption):Promise<IRequest>{
    return new Promise<IRequest>(async (c, e) => {
        let req: http.ClientRequest;

        const endpoint = parseUrl(options.url!);
        const rawRequest = await this.getNodeRequest(options);

        const opts: https.RequestOptions = {
            hostname: endpoint.hostname,
            port: endpoint.port ? parseInt(endpoint.port) : (endpoint.protocol === 'https:' ? 443 : 80),
            protocol: endpoint.protocol,
            path: endpoint.path,
            method: options.type || 'GET',
            headers: options.headers,
            agent: undefined,
            rejectUnauthorized:  true
        };

        if (options.user && options.password) {
            opts.auth = options.user + ':' + options.password;
        }

        req = rawRequest(opts, (res: http.IncomingMessage) => {
            const followRedirects: number =  3;
            if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && followRedirects > 0 && res.headers['location']) {
                this.request({
                    ...options,
                    url: res.headers['location'],
                }).then(c, e);
            } else {
                let stream = res;

                if (res.headers['content-encoding'] === 'gzip') {
                    stream = res.pipe(createGunzip()) as unknown as http.IncomingMessage;
                }

                c({ res, stream: stream } as unknown as IRequest);
            }
        });

        req.on('error', e);

        if (options.data) {
            if (typeof options.data === 'string') {
                req.write(options.data);
            }
        }

        req.end();
    });
  }

  private async getNodeRequest(options: IRequestOption): Promise<any> {
    const module = await import('https')
    return module.request;
}

  private unzipTemplate(downloadpath:Path){
      return Promise.resolve("")
  }

}


export const downloadPackage = (pack:string):Promise<any>=>{


  return  Promise.resolve(path.join(LocalPaths.APPDATA,'template','stunicons-0.0.1','template'));
}
