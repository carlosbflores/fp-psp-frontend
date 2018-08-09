import Storage from 'backbone.storage';
import Model from './model';
import Collection from './collection';

var ApplicationsStorage = Storage.extend({
  model: Model,
  collection: Collection,
  getSubHeaderItems(model) {
    if (model && model.get('name')) {
      return {
        mainItem: {
          name: `${model.get('name')} :: ${model.get('description')}`
        },
        link: `/#hubs/${model.get('id')}`
      };
    }
  }
});

export default new ApplicationsStorage();
