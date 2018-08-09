import Storage from 'backbone.storage';
import Model from './model';
import Collection from './collection';

var OrganizationsStorage = Storage.extend({
  model: Model,
  collection: Collection,
  getSubHeaderItems(model) {
    return {
      mainItem: {
        name: model.get('name'),
        link: `/#organizations/${model.get('id')}`,
        logoUrl: model.get('logoUrl') || '/static/images/icon_logo_place.png'
      },
      navigationItems: []
    };
  },
  getUserSubHeaderItems(model) {
    return {
      mainItem: {
        name: model.get('name'),
        link: `/#organizations/${model.get('id')}`
      },
      navigationItems: []
    };
  },
  getHubAdminHeaderItems(model) {
    return {
      mainItem: {
        name: model.get('name'),
        link: `/#organizations/${model.get('id')}`
      },
      navigationItems: []
    };
  }
});

export default new OrganizationsStorage();
