import Mn from 'backbone.marionette';
import $ from 'jquery';
import Bn from 'backbone';
import Template from './layout-template.hbs';
import utils from '../utils';
import FamiliesColecction from '../families/collection';
import OrganizationsModel from '../organizations/model';
import CitiesModel from '../cities/model';
import CountiesModel from '../countries/model';
import FamiliesModel from '../families/model';

import ModalService from '../modal/service';
import FlashesService from '../flashes/service';
import ItemView from './item/view';



export default Mn.View.extend({
  template: Template,
  collection:  new Bn.Collection(),
  citiesCollection: new CitiesModel(),
  countiesCollection: new CountiesModel(),
  organizationsCollection: new OrganizationsModel(),
  familiesModel: new FamiliesModel(),
  regions: {
    list: '#family-list'
  },
  events: {
    'click #submit': 'handleSubmit',
    'keypress #search': 'handleSubmit'
  },
  initialize(options) {
    this.app = options.app;
    this.collection.on('sync', this.render);
    this.collection.on('remove', this.render);



  },
  onRender() {
    setTimeout(() => {
      this.$el.find('#search').focus();
    }, 0);
    $("#navbar1 ul li").removeClass('active');

    this.showList();
    let self = this;
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

        if ( self.app.getSession().userHasRole('ROLE_APP_ADMIN') ) {
          $('#organization').attr('disabled', 'true');
          $('#organization').val(self.app.getSession().get('user').organization.id);
        }
      }
    });
  },
  showList() {

    let element = this.$el.find('#family-list');
    element.empty();

    this.collection.forEach(item => {

      let itemView = new ItemView({
        model: item,
        deleteFamily: this.deleteFamily.bind(this),
        itemViewOptions: {
          className: "col-md-4 col-xs-6"
        },
      });

      // Render the view, and append its element
      // to the list/table
      element.append(itemView.render().el);
    });

  },
  handleSubmit(event) {
    let freeText = $('#search').val();
    if (event.which === 13 || event.which === 1) {
      if(freeText !== ''){
        $('#search').parent().removeClass('has-error');
        let self = this;
        let container = this.$el.find('.list-container').eq(0);
        const section = utils.getLoadingSection(container);

        self.collection.reset();
        this.getRegion('list').empty();
        section.loading();

       let params = {
         free_text: freeText
       };
        if(self.app.getSession().get('user').application != null){
          params.applicationId = self.app.getSession().get('user').application.id
        }

        let elements = new FamiliesColecction();
        elements.fetch({
          data: params,
          success(response) {
            self.collection = response;
            self.showList();
            section.reset();
          }
        });
      }else {

        $('#search').parent().addClass('has-error');
      }


    }
  },

  deleteFamily(model) {
    let self = this;
    ModalService.request('confirm', {
      title: t('family.manage.messages.delete-confirm-title'),
      text: t('family.manage.messages.delete-confirm')
    }).then(confirmed => {
      if (!confirmed) {
        return;
      }

      model.set("id", model.get('familyId'));
      model.destroy({
          success: () => self.handleDestroySuccess(),
          error: (item, response) =>  self.handleDestroyError(response),
          wait:true
        });
    });
  },
  handleDestroySuccess() {
    this.showList();
    return FlashesService.request('add', {
      timeout: 2000,
      type: 'info',
      body: t('family.manage.messages.delete-done')
    });
  },

  handleDestroyError(error) {
    return FlashesService.request('add', {
      timeout: 2000,
      type: 'danger',
      body: error.responseJSON? error.responseJSON.message : "Error"
    });
  }


});
