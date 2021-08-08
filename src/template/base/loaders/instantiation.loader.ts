import { IDeProcessor } from "../../tempelating/actions/install/deprocessor/base.deprocessor";
import { CompositionDeprocessor } from "../../tempelating/actions/install/deprocessor/composition.deprocessor";
import { IPackageOptions, IProcessor } from "../../tempelating/actions/package/processor/base.processor";
import { CompositionProcessor } from "../../tempelating/actions/package/processor/composition.processor";
import { ReadMeProcessor } from "../../tempelating/actions/package/processor/markdown.processor";
import { NodemodulesProcessor } from "../../tempelating/actions/package/processor/nodemodules.processor";
import { StructureProcessor } from "../../tempelating/actions/package/processor/structure.processor";
import { IPackageTemplate } from "../models/template.model";

export function createDefaultProcessors(composition: IPackageTemplate, options: IPackageOptions = {}): IProcessor[] {
	return [
		new NodemodulesProcessor(composition),
		new CompositionProcessor(composition),  
        new ReadMeProcessor(composition,options),
		new StructureProcessor(composition)
	];
}

export function createDefaultDeProcessors(composition:IPackageTemplate,path:string,opt?:boolean):IDeProcessor[]{

	return[
		new CompositionDeprocessor(composition,path)
	]
}