import Storage from 'backbone.storage';
import Model from './model';
import Collection from './collection';

var UsersStorage = Storage.extend({
  model: Model,
  collection: Collection
});

export default new UsersStorage();
