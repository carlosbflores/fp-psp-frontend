import Mn from 'backbone.marionette';
import Bn from 'backbone';
import $ from 'jquery';
import Template from './template.hbs';
import CollectionView from '../index/collection-view';
import utils from '../../utils';
import FamiliesCollection from './collection';

export default Mn.View.extend({
  template: Template,
  collection: new CollectionView(),
  regions: {
    list: '#family-list'
  },
  events: {
    'click #submit': 'handleSubmit',
    'keypress #search': 'handleSubmit'
  },
  initialize(options) {
    this.collection = new Bn.Collection();
    this.app = options.app;
  },
  onRender() {
    setTimeout(() => {
      this.$el.find('#search').focus();
    }, 0);
    this.showList();
  },
  showList() {
    this.getRegion('list').show(
      new CollectionView({collection: this.collection})
    );
  },
  handleSubmit(event) {
    if (event.which === 13 || event.which === 1) {
      event.preventDefault();
      const self = this;
      const container = this.$el.find('.list-container').eq(0);
      const section = utils.getLoadingSection(container);

      self.collection.reset();
      this.getRegion('list').empty();
      section.loading();

      const elements = new FamiliesCollection();
      elements.fetch({
        data: {name: $('#search').val()},
        success(response) {
          self.collection = response;
          self.showList();
          section.reset();
        }
      });
    }
  }
});
