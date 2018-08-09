import Storage from 'backbone.storage';
import Model from './model';

var UsersStorage = Storage.extend({
  model: Model
});

export default new UsersStorage();
