import { PackageTools } from "../../base/models/template.model";

export interface PackageInstall{
    package:string,
    option:string,
}


export function PerfomInstall(
   tool:string,
   optionpkg:PackageInstall
) 
{
    let command = PackageTools.NPM;
  if (tool == 'npm') {
      command =PackageTools.NPM;
  }else if (tool == 'yarn') {
      command = PackageTools.YARN
  }else if (tool == 'bower') {
      command = PackageTools.BOWER
  }

  

}