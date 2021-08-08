import { TemplateEnviroment } from "../../base/env/template.env";
import { IPackageDependencies } from "./dependencies.utils";


  export class PackageDependencies implements IPackageDependencies {
    /**
     * @private
     * Resolve the dependencies to be added to the package.json.
     *
     * @param {Object|string|string[]} dependencies
     * @return {Promise} a 'packageName: packageVersion' object
     * 
     * 
     */
    async _resolvePackageJsonDependencies(dependencies:any) {
      if (typeof dependencies === 'string') {
        dependencies = [dependencies];
      } else if (typeof dependencies !== 'object') {
        throw new TypeError(
          'resolvePackageJsonDependencies requires an object'
        );
      } else if (!Array.isArray(dependencies)) {
        dependencies = await Promise.all(
          Object.entries(dependencies).map(([pkg, version]) =>
            version
              ? Promise.resolve([pkg, version])
              : this.resolvePackage(pkg, version)
          )
        );
        return Object.fromEntries(
          dependencies.filter((...args:any) => args.length > 0 && args[0])
        );
      }

      return Object.fromEntries(dependencies.map((args:any)=> this.resolvePackage(args)));
    }

    /**
     * Add dependencies to the destination the package.json.
     *
     * @param {Object|string|string[]} dependencies
     * @return {Promise} a 'packageName: packageVersion' object
     */
    async addDependencies(dependencies:any) {
      dependencies = await this._resolvePackageJsonDependencies(dependencies);
      TemplateEnviroment.packageJson.merge({dependencies});
      return dependencies;
    }

    /**
     * Add dependencies to the destination the package.json.
     *
     * @param {Object|string|string[]} dependencies
     * @return {Promise} a 'packageName: packageVersion' object
     */
    async addDevDependencies(devDependencies:any) {
      devDependencies = await this._resolvePackageJsonDependencies(
        devDependencies
      );
      TemplateEnviroment.packageJson.merge({devDependencies});
      return devDependencies;
    }

    async  resolvePackage(...args:any):Promise<[string,string]> {

      if (typeof args != 'string' || !Array.isArray(args)) {
        return Promise.resolve(['',''])
      }
      if (args.length>0 && args[0]) {
        return Promise.resolve([args[0],args[1]])
      }

      const arrayargs = args.split('@');
      return Promise.resolve([arrayargs[0],arrayargs[1]])
    }

  }	



