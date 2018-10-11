import Mn from 'backbone.marionette';
import $ from 'jquery';
import 'select2';
import env from '../../env';
import Template from './template.hbs';
import OrganizationModel from '../../organizations/model';
import SurveyModel from '../../surveys/add/model';
import FlashesService from '../../flashes/service';

export default Mn.View.extend({
  template: Template,
  organizationsCollection: new OrganizationModel(),
  surveysCollection: new SurveyModel(),
  events: {
    'click #submit': 'downloadCsv'
  },
  initialize(options) {
    this.app = options.app;
    this.filters = {
      date_from: '',
      date_to: '',
      family_id: '',
      application_id: '',
      organizations: [],
      survey_id: ''
    };
  },
  onRender() {
    this.setCalendarToVariable('#dateFrom');
    this.setCalendarToVariable('#dateTo');
    this.$el.find('#organization').select2({});
    this.getOrganizations();
    this.getSurveys();
  },
  getOrganizations() {
    let self = this;
    this.organizationsCollection.urlRoot = `${env.API}/organizations/list`;
    self.organizationsCollection.fetch({
      success(response) {
        self.organizationsCollection = response.attributes;
        $.each(self.organizationsCollection, (index, element) => {
          self.buildOption('#organization', element, 'name');
        });
      }
    });
  },
  getSurveys() {
    let self = this;
    this.surveysCollection.urlRoot = `${env.API}/surveys/list`;
    self.surveysCollection.fetch({
      success(response) {
        self.surveysCollection = response.attributes;
        $.each(self.surveysCollection, (index, element) => {
          self.buildOption('#survey', element, 'title');
        });
      }
    });
  },
  buildOption(selector, element, attr) {
    $(selector).append(
      $('<option></option>')
        .attr('value', element.id)
        .text(element[attr])
    );
  },
  setCalendarToVariable(varName) {
    let $date = this.$el.find(varName);
    $date.datetimepicker({
      format: 'DD/MM/YYYY',
      locale: this.app.getSession().get('locale') || 'es'
    });
  },
  downloadCsv(event) {
    event.preventDefault();

    this.loadFilters();
    let errors = this.validate(this.filters);
    if (errors.length) {
      errors.forEach(error => {
        FlashesService.request('add', {
          timeout: 2000,
          type: 'warning',
          title: error
        });
      });
      return;
    }

    const a = window.document.createElement('a');
    a.href = `${env.API}/reports/snapshots/csv?${$.param(this.filters)}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  },
  loadFilters() {
    this.filters.date_from = this.$el.find('#date1').val();
    this.filters.date_to = this.$el.find('#date2').val();

    let organizationArray = [];
    if (this.app.getSession().userHasRole('ROLE_HUB_ADMIN')) {
      $('#organization')
        .val()
        .forEach(element => {
          organizationArray.push(parseInt(element, 10));
        });
    } else if (this.app.getSession().userHasRole('ROLE_APP_ADMIN')) {
      organizationArray.push(this.app.getSession().get('user').organization.id);
      $('#organization')
        .val()
        .forEach(element => {
          organizationArray.push(parseInt(element, 10));
        });
    }

    this.filters.organizations = organizationArray;
    this.filters.application_id = this.app.getSession().get('user').application
      ? this.app.getSession().get('user').application.id
      : '';
    this.filters.survey_id = $('#survey').val();
  },
  validate(filters) {
    const errors = [];
    if (!filters.date_from) {
      errors.push(
        t('report.snapshot.messages.validation.required', {
          field: t('report.snapshot.search.date-from')
        })
      );
    }
    if (!filters.date_to) {
      errors.push(
        t('report.snapshot.messages.validation.required', {
          field: t('report.snapshot.search.date-to')
        })
      );
    }
    if (!filters.survey_id) {
      errors.push(
        t('report.snapshot.messages.validation.required', {
          field: t('report.snapshot.search.survey')
        })
      );
    }
    return errors;
  }
});
