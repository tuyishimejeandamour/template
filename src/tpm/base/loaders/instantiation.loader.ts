import { IPackageOptions, IProcessor } from "../../tempelating/actions/package/processor/base.processor";
import { CompositionProcessor } from "../../tempelating/actions/package/processor/composition.processor";
import { ReadMeProcessor } from "../../tempelating/actions/package/processor/markdown.processor";
import { NodemodulesProcessor } from "../../tempelating/actions/package/processor/nodemodules.processor";
import { StructureProcessor } from "../../tempelating/actions/package/processor/structure.processor";
import { IPackageTemplate } from "../models/template.model";

export function createDefaultProcessors(composition: IPackageTemplate, options: IPackageOptions = {}): IProcessor[] {
	return [
		new CompositionProcessor(composition),
        new NodemodulesProcessor(composition),
        new ReadMeProcessor(composition,options),
		new StructureProcessor(composition)
		
	];
}
