import path from "path";

import * as fs from 'fs-extra'
import { LocalPaths } from "../../base/env/path.env";


export const downloadPackage = (pack:string):Promise<any>=>{

  fs.mkdirpSync(path.join(LocalPaths.APPDATA,'template'))
  fs.chmodSync(path.join(LocalPaths.APPDATA,'template'),'077')
  const stream = fs.readFileSync(path.join(__dirname,'../../../../test/stunicons-0.0.1.template'))
  fs.writeFileSync(path.join(LocalPaths.APPDATA,'template','stunicons-0.0.1.template'),stream)

  //fs.copyFileSync(path.join(__dirname,'../../../../test/stunicons-0.0.1.template'),path.join(LocalPaths.APPDATA,'template'))
  return  Promise.resolve(path.join(LocalPaths.APPDATA,'template','stunicons-0.0.1'));
}