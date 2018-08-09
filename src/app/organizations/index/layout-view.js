import Mn from 'backbone.marionette';
import $ from 'jquery';
import { debounce } from 'lodash';
import env from '../../env';
import Template from './layout-template.hbs';
import CollectionView from './collection-view';
import utils from '../../utils';
import Model from '../model';
import Collection from '../collection';

export default Mn.View.extend({
  template: Template,
  collection: new CollectionView(),
  regions: {
    list: '#organization-list'
  },
  events: {
    'input #search': 'onSearchInput'
  },
  initialize(options) {
    this.app = options.app;
    this.applicationId = options.applicationId;
    // eslint-disable-next-line no-undef
    _.bindAll(this, 'loadMore');
    // bind scroll event to window
    $(window).scroll(debounce(this.loadMore, 50));

    this.collection = new Collection();
    this.collection.on('update', this.showList());

    this.params = {};
    if (this.applicationId) {
      this.collection.url = `${env.API}/organizations/application`;
      this.params.applicationId = this.applicationId;
    }
    this.serverFetch();

    this.debounceServerFetch = debounce(this.serverFetch, 500, {
      leading: false,
      trailing: true
    });
  },

  onAttach() {
    if (this.app.getSession().userHasRole('ROLE_HUB_ADMIN')) {
      this.$el.find('#add-new').show();
    }
  },
  getTemplate() {
    return Template;
  },
  showList() {
    this.getRegion('list').show(
      new CollectionView({ collection: this.collection, app: this.app })
    );
  },
  onSearchInput() {
    let searchTerm = this.$el.find('#search').val();
    this.debounceServerFetch(searchTerm);
  },
  serverFetch(searchTerm) {
    const container = this.$el.find('.list-container').eq(0);
    const section = utils.getLoadingSection(container);
    section.loading();

    this.params.filter = searchTerm;
    this.params.page = 1;

    this.collection.reset();
    this.collection.fetch({
      data: this.params,
      success(collection, response) {
        collection.reset(response.list);
        collection.currentPage = response.currentPage;
        collection.totalPages = response.totalPages;
        section.reset();
      }
    });
  },
  loadMore(e) {
    e.preventDefault();

    let scrollHeight = $(document).height();
    let scrollPosition = $(window).height() + $(window).scrollTop();
    let margin = 150; // margin to scroll from the bottom

    // if we are closer than 'margin' to the end of the content, load more books
    if (scrollPosition + margin >= scrollHeight) {
      this.searchMore();
    }
  },
  searchMore() {
    var self = this;
    if (this.collection.currentPage < this.collection.totalPages) {
      this.params.page = this.collection.currentPage + 1;

      let moreElements = new Model();
      if (this.applicationId) {
        moreElements.urlRoot = `${env.API}/organizations/application`;
      }

      moreElements.fetch({
        data: this.params,
        success(response) {
          self.collection.add(response.get('list'));
          self.collection.currentPage = response.get('currentPage');
        }
      });
    }
  }
});
