import Mn from 'backbone.marionette';
import Template from './template.hbs';
import SnapshotsTemplate from '../snapshots-template.hbs';
import storage from '../../storage';
import CollectionView from './collection-view';
import SnapshotCollection from './collection';

export default Mn.View.extend({
  template: SnapshotsTemplate,
  collection: CollectionView,
  regions: {
    list: '#family-snapshots'
  },
  initialize(options) {
    this.app = options.app;
    this.snapshotId = options.snapshotId;
    this.collection = options.collection;
  },
  onRender() {
    const headerItems = storage.getSubHeaderItems(this.model);
    this.app.updateSubHeader(headerItems);
    this.showList();
  },
  showList() {
    var self = this;
    var collection = new SnapshotCollection();
    collection.fetch({
      data: { family_id: this.model.attributes.id }
    }).done(function(){
      self.getRegion('list').show(
        new CollectionView({ collection: collection})
      );
    });
  },

});
