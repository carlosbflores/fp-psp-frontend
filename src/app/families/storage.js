import Storage from 'backbone.storage';
import Model from './model';
import Collection from './collection';

var FamiliesStorage = Storage.extend({
  model: Model,
  collection: Collection,
  getSubHeaderItems(model) {
    return {
      mainItem: {
        name: `${t('subheader.family')} ${model.get('person').lastName || ''}`,
        link: `/#families/${model.get('id')}`
      },
      navigationItems: [
        {
          name: t('subheader.interventions'),
          link: `/#families/${model.get('id')}/interventions`
        },
        {
          name: t('subheader.snapshots'),
          link: `/#families/${model.get('id')}/snapshots`
        }
      ]
    };
  }
});

export default new FamiliesStorage();
