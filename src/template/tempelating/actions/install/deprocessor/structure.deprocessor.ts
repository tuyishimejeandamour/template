
import { IPackageTemplate } from "../../../../base/models/template.model";
import { Path } from "../../../../base/utils/path";
import { FileTemplateGenerator } from "../../../../platform/files/generate.platform";
import { BaseDiprocessor, InstallFile } from "./base.deprocessor";



export class StructureDeprocessor extends BaseDiprocessor {

    private files: InstallFile[] = []
    constructor(compositon: IPackageTemplate, path: string) {
        super(compositon, path);

    }



    onInit(file: InstallFile): Promise<InstallFile> {
        if (this.composition.templateKind == 'starter') {
            this.files = [...this.files, file]

            return Promise.resolve(file)
        }
        const path = new Path(file.from).normalize();
        if (/src/i.test(path)) {
            file.category = 'src';
        } else
            if (
                /\.svg$/i.test(path) ||
                /\.png$/i.test(path) ||
                /\.jpg$/i.test(path) ||
                /\.jpeg$/i.test(path) ||
                /\.pdf$/i.test(path) ||
                /\.doc$/i.test(path)

            ) {
                file.category = 'assets'
            }
        this.files = [...this.files, file]
        return Promise.resolve(file)
    }

    onprocess(): Promise<void> {
         const generator = new FileTemplateGenerator();

        if (this.composition.templateKind == 'starter') {
            console.log(this.files)
            this.files.forEach(file => {
                generator.copyTpl(new Path(file.from),new Path(file.to))
            });
        }
        return Promise.resolve()
    }
}