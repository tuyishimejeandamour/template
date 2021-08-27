import assert from "assert";
import _ from "lodash";
import * as fsEx from 'fs-extra'
import { Publisher } from "../../base/models/store.model";
import { Path } from "../../base/utils/path";

export interface IStore {
	publishers: Publisher[];
}

export interface IGetOptions {
	promptToOverwrite?: boolean;
	promptIfMissing?: boolean;
}


class Storage {
    private fs = fsEx;
    private path:Path;
    private name:string;
    private indent = 2;
    private existed :any;
    private _cachedStore:any;
    private disableCache:boolean;
    constructor(name:string, configPath:Path, options:any = {}) {
      
  
      if (typeof options === 'boolean') {
        options = {lodashPath: options};
      }
  
      _.defaults(options, {
        disableCache: false,
      });
  
      assert(configPath, 'A config filepath is required to create a storage');
  
      this.path = configPath;
      this.name = name;
      this.disableCache = options.disableCache
      this.existed = Object.keys(this._store).length > 0;
  
    }
  
    /**
     * Return the current store as JSON object
     * @return {Object} the store content
     * @private
     */
    get _store() {
      const store = this._cachedStore || this.fs.readJSON(this.path.path, {});
      if (!this.disableCache) {
        this._cachedStore = store;
      }
  
      if (!this.name) {
        return store || {};
      }
  
      return  store[this.name] || {};
    }
  
    /**
     * Persist a configuration to disk
     * @param {Object} val - current configuration values
     * @private
     */
    _persist(value:any) {
      let fullStore;
      if (this.name) {
        fullStore = this.fs.readJSONSync(this.path.path, {});
       
          fullStore[this.name] = value;
        
      } else {
        fullStore = value;
      }
  
      this.fs.writeJSONSync(this.path.path, fullStore,{spaces:this.indent});
    }
  
    /**
     * Save a new object of values
     */
    save() {
      this._persist(this._store);
    }
  
    /**
     * Get a stored value
     * @param  {String} key  The key under which the value is stored.
     * @return {*}           The stored value. Any JSON valid type could be returned
     */
    get(key:string) {
      return this._store[key];
    }
  
    /**
     * Get a stored value from a lodash path
     * @param  {String} path  The path under which the value is stored.
     * @return {*}           The stored value. Any JSON valid type could be returned
     */
    getPath(path:Path) {
      return _.get(this._store, path.path);
    }
  
    /**
     * Get all the stored values
     * @return {Object}  key-value object
     */
    getAll() {
      return _.cloneDeep(this._store);
    }
  
    /**
     * Assign a key to a value and schedule a save.
     * @param {String} key  The key under which the value is stored
     * @param {*} val  Any valid JSON type value (String, Number, Array, Object).
     * @return {*} val  Whatever was passed in as val.
     */
    set(key:string, value:any) {
      assert(!_.isFunction(value), "Storage value can't be a function");
  
      const store = this._store;
  
      if (_.isObject(key)) {
        value = _.assignIn(store, key);
      } else {
        store[key] = value;
      }
  
      this._persist(store);
      return value;
    }
  
    /**
     * Assign a lodash path to a value and schedule a save.
     * @param {String} path  The key under which the value is stored
     * @param {*} val  Any valid JSON type value (String, Number, Array, Object).
     * @return {*} val  Whatever was passed in as val.
     */
    setPath(path:Path, value:any) {
      assert(!_.isFunction(value), "Storage value can't be a function");
  
      const store = this._store;
      _.set(store, path.path, value);
      this._persist(store);
      return value;
    }
  
    /**
     * Delete a key from the store and schedule a save.
     * @param  {String} key  The key under which the value is stored.
     */
    delete(key:string) {
      const store = this._store;
      delete store[key];
      this._persist(store);
    }
  
    /**
     * Setup the store with defaults value and schedule a save.
     * If keys already exist, the initial value is kept.
     * @param  {Object} defaults  Key-value object to store.
     * @return {*} val  Returns the merged options.
     */
    defaults(defaults:Object) {
      assert(
        _.isObject(defaults),
        'Storage `defaults` method only accept objects'
      );
      const store = _.defaults({}, this._store, defaults);
      this._persist(store);
      return this.getAll();
    }
  
    /**
     * @param  {Object} defaults  Key-value object to store.
     * @return {*} val  Returns the merged object.
     */
    merge(source:any) {
      assert(_.isObject(source), 'Storage `merge` method only accept objects');
      const value = _.merge({}, this._store, source);
      this._persist(value);
      return this.getAll();
    }
  
    /**
     * Create a child storage.
     * @param  {String} path - relative path of the key to create a new storage.
     *                         Some paths need to be escaped. Eg: ["dotted.path"]
     * @return {Storage} Returns a new Storage.
     */
    createStorage(path:Path) {
      const childName = this.name ? `${this.name}.${path.path}` : path.path;
      return new Storage(childName, this.path, true);
    }
  
   
  }