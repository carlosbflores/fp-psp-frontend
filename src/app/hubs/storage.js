import Storage from 'backbone.storage';
import Model from './model';
import Collection from './collection';

var ApplicationsStorage = Storage.extend({
  model: Model,
  collection: Collection,
  getSubHeaderItems(model) {
    return {
      mainItem: {name: `${model.get('name')} :: ${model.get('description')}`},
      link: `/#applications/${model.get('id')}`
    };
  }
});

export default new ApplicationsStorage();
