import Mn from 'backbone.marionette';
import $ from 'jquery';
import Bn from 'backbone';
import Template from '../../../../../families/index/layout-template.hbs';
import CollectionView from '../../../../../families/index/collection-view';
import utils from '../../../../../utils';
import FamiliesCollection from '../../../../../families/collection';
import OrganizationsModel from '../../../../organizations/model';
import CitiesModel from '../../../../../cities/model';
import CountiesModel from '../../../../../countries/model';

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
    this.organizationId = options.organizationId;
  },
  onRender() {
    let {organizationId} = this;
    setTimeout(() => {
      this.$el.find('#search').focus();
    }, 0);
    this.showList();
    let self = this;

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
        $('#organization').val(organizationId);
        $('#organization').attr('disabled', 'true');
      }
    });
    setTimeout(() => {
      $(`a[href$="organizations/${this.organizationId}/families"]`)
        .parent()
        .addClass('subActive');
    }, 200);

  },
  showList() {
    this.getRegion('list').show(
      new CollectionView({collection: this.collection})
    );
  },
  handleSubmit(event) {
    if (event.which === 13 || event.which === 1) {
      event.preventDefault();
      let container = this.$el.find('.list-container').eq(0);
      const section = utils.getLoadingSection(container);

      this.collection.reset();
      this.getRegion('list').empty();
      section.loading();

      let params = {
        organization_id: $('#organization').val(),
        country_id: $('#country').val(),
        city_id: $('#city').val(),
        free_text: $('#search').val()
      };

      let self = this;
      let elements = new FamiliesCollection();
      elements.fetch({
        data: params,
        success(response) {
          // setear al collection
          self.collection = response;
          self.showList();
          section.reset();
        }
      });
    }
  }
});
