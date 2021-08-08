import { IPackageDependencies } from "./dependencies.utils";


  export class PackageDependencies implements IPackageDependencies {
    /**
     * @private
     * Resolve the dependencies to be added to the package.json.
     *
     * @param {Object|string|string[]} dependencies
     * @return {Promise} a 'packageName: packageVersion' object
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
              : this.env.resolvePackage(pkg, version)
          )
        );
        return Object.fromEntries(
          dependencies.filter((...args) => args.length > 0 && args[0])
        );
      }

      const entries = await Promise.all(
        dependencies.map((dependency:any) => this.env.resolvePackage(dependency))
      );
      return Object.fromEntries(entries);
    }

    /**
     * Add dependencies to the destination the package.json.
     *
     * @param {Object|string|string[]} dependencies
     * @return {Promise} a 'packageName: packageVersion' object
     */
    async addDependencies(dependencies:any) {
      dependencies = await this._resolvePackageJsonDependencies(dependencies);
      this.packageJson.merge({dependencies});
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
      this.packageJson.merge({devDependencies});
      return devDependencies;
    }

  }	

