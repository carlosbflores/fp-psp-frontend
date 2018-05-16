import Mn from 'backbone.marionette';
import Bn from 'backbone';
import $ from 'jquery';
import Template from './layout-template.hbs';
import CollectionView from './collection-view';
import utils from '../../utils';
import FamiliesCollection from '../collection';
import OrganizationsModel from '../../management/organizations/model';
import CitiesModel from '../../cities/model';
import CountiesModel from '../../countries/model';

export default Mn.View.extend({
  template: Template,
  collection: new CollectionView(),
  citiesCollection: new CitiesModel(),
  countiesCollection: new CountiesModel(),
  organizationsCollection: new OrganizationsModel(),
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

    this.loadSelects();
  },
  showList() {
    this.getRegion('list').show(
      new CollectionView({collection: this.collection})
    );
  },
  loadSelects() {
    const self = this;

    this.citiesCollection.fetch({
      success(response) {
        self.citiesCollection = response.toJSON();
        $.each(self.citiesCollection, (index, element) => {
          $('#city').append(
            $('<option></option>')
              .attr('value', element.id)
              .text(element.city)
          );
        });
      }
    });

    this.countiesCollection.fetch({
      success(response) {
        self.countiesCollection = response.toJSON();
        $.each(self.countiesCollection, (index, element) => {
          $('#country').append(
            $('<option></option>')
              .attr('value', element.id)
              .text(element.country)
          );
        });
      }
    });

    this.organizationsCollection.fetch({
      success(response) {
        self.organizationsCollection = response.get('list');
        $.each(self.organizationsCollection, (index, element) => {
          $('#organization').append(
            $('<option></option>')
              .attr('value', element.id)
              .text(element.name)
          );
        });
      }
    });
  },
  handleSubmit(event) {
    event.preventDefault();
    if (event.which === 13 || event.which === 1) {
      const self = this;
      const container = this.$el.find('.list-container').eq(0);
      const section = utils.getLoadingSection(container);

      self.collection.reset();
      this.getRegion('list').empty();
      section.loading();

      const params = {
        organization_id: $('#organization').val(),
        country_id: $('#country').val(),
        city_id: $('#city').val(),
        free_text: $('#search').val()
      };

      const elements = new FamiliesCollection();
      elements.fetch({
        data: params,
        success(response) {
          self.collection = response;
          self.showList();
          section.reset();
        }
      });
    }
  }
});
