var _  = require('lodash');

class ModelStore {
  constructor(){
    this._store = {};
  }
  inject(collections){
    console.log('Injecting Collections: ', collections);
    this._store = collections;
  }
  model(modelName){
    return this._store[modelName];
  }
}

export default new ModelStore();
