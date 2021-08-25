import path from "path";

import { LocalPaths } from "../../base/env/path.env";
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

export interface IDownloadOption{
  templatePath:Path,
  extensionDownloadPath:Path,
}
export interface IDownload {

	download(pack:string,type:EDownload): Promise<void>;

}

export class Download implements IDownload {

	constructor(
	 private fileService:FileTemplateGenerator,
   private option:IDownloadOption
	) { }

	async download(resource:string,type:EDownload): Promise<void> {
    
		if (type === EDownload.EXTENISON) {
			await this.downloadExtension(resource);
			return;
		}
		const {context,tempname} = await this.downloadTemplate(resource);
		if (context.res.statusCode === 200) {
      
			await this.fileService.write(new Path(this.option.templatePath.join(tempname)), context.stream);
		} else {
			throw new Error(`Expected 200, got back ${context.res.statusCode} instead.`);
		}
	}

  async  downloadExtension(name:string) {
    
  }

  async downloadTemplate(templateName:string):Promise<{context:IRequest,tempname:string}>{

    return Object.create(null)
  
  }

}


export const downloadPackage = (pack:string):Promise<any>=>{

  // const stream = fs.readFileSync(path.join(__dirname,'../../../../test/stunicons-0.0.1.template'))
  // fs.writeFileSync(path.join(LocalPaths.APPDATA,'template','stunicons-0.0.1.template'),stream)

  //fs.copyFileSync(path.join(__dirname,'../../../../test/stunicons-0.0.1.template'),path.join(LocalPaths.APPDATA,'template'))
  return  Promise.resolve(path.join(LocalPaths.APPDATA,'template','stunicons-0.0.1','template'));
}