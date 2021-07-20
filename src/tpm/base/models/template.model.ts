

export interface TemplateSettings{
    project:string,
    framework:string,
    description:string,
    category:string,
    keyword:string,
    author:string,
    version:string,
    ignore?:string[]
    dependency?:any,
    devdependency?:any,
    structure:DirStructure[]
}

export interface DirStructure{
      name:string,
      files:any
}