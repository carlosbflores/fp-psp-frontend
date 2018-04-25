import Mn from 'backbone.marionette';
import {history} from "backbone";
import $ from "jquery";
import env from "../../env";
import utils from '../../utils';
import ModalService from "../../modal/service";
import FlashesService from "../../flashes/service";
import storage from '../storage';
import Template from './template.hbs';
import UserModel from '../../management/users/model';

export default Mn.View.extend({
  template: Template,
  events: {
    'click #submit': 'handleSubmit'
  },
  initialize(options) {
    this.model = options.model;
  },
  serializeData() {
    return {
      family: this.model.attributes
    };
  },
  onAttach() {
    var self = this;

    let users = new UserModel();
    users.urlRoot = `${env.API}/users/survey-users`;
    users.fetch({
      success(response) {
        var list = response.toJSON();

        if (!self.model.get('user')) {
          $('#select-user').append(
            $('<option disabled selected value></option>')
              .text(t('family.form.select-user')));
        }

        $.each(list, (index, element) => {
          $('#select-user').append(
            $('<option></option>')
              .attr('value', element.userId)
              .text(element.username)
          );
        });

        if (self.model.get('user')) {
          $('#select-user').val(self.model.get('user').userId);
        }
      }
    });
  },
  handleSubmit(event) {
    event.preventDefault();

    ModalService.request('confirm', {
      title: t('family.form.save.confirm-title'),
      text: t('family.form.save.confirm-text')
    }).then(confirmed => {
      if (confirmed) {
        const button = utils.getLoadingButton(this.$el.find('#submit'));
        button.loading();

        let user = {userId: $('#select-user').val()};
        this.model.set('user', user);
        this.model.set('person', undefined);

        storage
          .save(this.model)
          .then(() => {
            button.reset();
            history.navigate(`families/${this.model.get('id')}`, {trigger: true});
            FlashesService.request('add', {
              timeout: 3000,
              type: 'info',
              title: t('family.form.save.success')
            });
          })
          .catch(response => {
            if (response.status === 400) {
              FlashesService.request('add', {
                timeout: 3000,
                type: 'danger',
                title: t('family.form.save.failed')
              });
            }
            button.reset();
          });
      }
    });
  }
});
