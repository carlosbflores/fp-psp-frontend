/* eslint camelcase: 0 */
import Mn from 'backbone.marionette';
import $ from 'jquery';
import Template from './template.hbs';
import env from '../../env';
import session from '../../../common/session';
import { requiredInput, getLoadingButton  } from '../../../common/utils';
import FlashesService from '../../../common/flashes/service';

export default Mn.View.extend({
  template: Template,
  regions: {
    container: '#container',
    flashes: '#flashes'
  },
  events: {
    'click #btn-login': 'reset',
  },

  initialize(options) {
    this.app = options.app;
    session.fetch();

    FlashesService.setup({
      container: this.getRegion('flashes')
    });

  },
  onRender() {
    setTimeout(() => {
      this.$el.find('#password').focus();
    }, 0);

  },

urlParam(name){
  try {
    	let results = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`).exec(window.location.href);

    	return results[2] || 0;
  } catch (e) {
      FlashesService.request('add', {
        timeout: 2000,
        type: 'warning',
        title: 'Insufficient data'
      });
  }
},



  reset(event) {
    event.preventDefault();

    if(requiredInput($("#password")) && requiredInput($("#repeatPassword"))){
      if($("#password").val() === $("#repeatPassword").val() ){
        $("#password").parent().removeClass('has-error');
        $("#repeatPassword").parent().removeClass('has-error');

        const loginBtn = this.$el.find('#btn-login');
        const button = getLoadingButton(loginBtn);

        let params = {
          token: this.urlParam('token'),
          userId: this.urlParam('id'),
          password: $('#password').val(),
          repeatPassword: $('#repeatPassword').val()
        };

        let url = `${
          env.API_PUBLIC}/password/changePassword `;

          button.loading();
          $.ajax({
            url,
            type: 'POST',
            data: params,

            success() {
              FlashesService.request('add', {
                timeout: 4000,
                type: 'info',
                title: 'Password reset successfully !'
              });
              setTimeout(() => {
                window.location.replace(`/`);
              }, 3000);

            },
            error(xmlHttpRequest, textStatus) {
              if (xmlHttpRequest && xmlHttpRequest.status === 0) {
                FlashesService.request('add', {
                  timeout: 3000,
                  type: 'danger',
                  title: 'No connection to server'
                });
                return;
              }
              if (textStatus === 'Unauthorized') {
                FlashesService.request('add', {
                  timeout: 2000,
                  type: 'warning',
                  title: 'Not authorized'
                });
              } else {
                FlashesService.request('add', {
                  type: 'warning',
                  title: 'Wrong credentials. Please try again.',
                  timeout: 3000
                });
                $('#password').val('');
                $('#repeatPassword').val('');
                $('#password').focus();
              }
            },
            complete: () => {
              button.reset();
            }
          });
      }else{
        $("#password").parent().addClass('has-error');
        $("#repeatPassword").parent().addClass('has-error');
        FlashesService.request('add', {
          timeout: 3000,
          type: 'warning',
          title: 'Password does not match'
        });
      }
    }

  },


});
