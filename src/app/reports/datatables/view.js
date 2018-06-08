import Mn from 'backbone.marionette';
import Bn from "backbone";
import $ from 'jquery';
import 'select2';
import env from '../../env';
import utils from "../../utils";
import Template from './template.hbs';
import storage from "../storage";
import OrganizationModel from "../../management/organizations/model";
import FlashesService from "../../flashes/service";

export default Mn.View.extend({
  template: Template,
  organizationsCollection: new OrganizationModel(),
  events: {
    'click #submit': 'handleSearch',
    'keypress #search': 'handleSearch'
  },
  initialize(options) {
    this.app = options.app;
    this.filters = {
      date_from: '',
      date_to: '',
      family_id: '',
      application_id: '',
      organizations: []
    }
  },
  onRender() {
    const headerItems = storage.getSubHeaderItems();
    this.app.updateSubHeader(headerItems);
    $('.sub-menu-item[href$="reports/datatable"]')
      .parent()
      .addClass('subActive');

    this.setCalendarToVariable('#dateFrom');
    this.setCalendarToVariable('#dateTo');
    this.$el.find('#organization').select2({});
    this.getOrganizations();
  },
  getOrganizations() {
    let self = this;
    this.organizationsCollection.urlRoot = `${env.API}/organizations/list`;
    self.organizationsCollection.fetch({
      success(response) {
        self.organizationsCollection = response.attributes;
        $.each(self.organizationsCollection, (index, element) => {
          self.buildOption(element);
        });
      }
    });
  },
  buildOption(element) {
    $('#organization').append(
      $('<option></option>')
        .attr('value', element.id)
        .text(element.name));
  },
  setCalendarToVariable(varName) {
    let $date = this.$el.find(varName);
    $date.datetimepicker({
      format: 'DD/MM/YYYY',
      locale: this.app.getSession().get('locale') || 'es'
    });
  },
  handleSearch(event) {
    event.preventDefault();
    if (event.which === 13 || event.which === 1) {
      const container = this.$el.find('.list-container').eq(0);
      const section = utils.getLoadingSection(container);
      section.loading();

      this.filters.date_from = this.$el.find('#date1').val();
      this.filters.date_to = this.$el.find('#date2').val();

      let organizationArray = [];
      if (this.app.getSession().userHasRole('ROLE_HUB_ADMIN')) {
        $("#organization").val().forEach(element => {
          organizationArray.push(parseInt(element, 10));
        });
      } else if (this.app.getSession().userHasRole('ROLE_APP_ADMIN')) {
        organizationArray.push(this.app.getSession().get('user').organization.id);
      }

      this.filters.organizations = organizationArray;
      this.filters.application_id =
                this.app.getSession().get('user').application ? this.app.getSession().get('user').application.id : '';

      let errors = this.validate(this.filters);
      if (errors.length) {
        errors.forEach(error => {
          FlashesService.request('add', {
            timeout: 2000,
            type: 'warning',
            title: error
          });
        });
      } else {
        let model = new Bn.Model();
        model.urlRoot = `${env.API}/reports/family/indicators/json`;
        model.fetch({
          data: this.filters,
          success(response) {
            let $table = $('<table id="table" class="display" style="width:100%; font-size: 90%"></table>');
            $('#datatable-container').html($table);

            let $thead = $('<thead></thead>');
            let $tr = $('<tr></tr>');
            response.toJSON().headers.forEach((headerName) => {
              $tr.append(`<th>${headerName}</th>`);
            });
            $thead.append($tr);
            $table.append($thead);

            let $tbody = $('<tbody></tbody>');
            response.toJSON().rows.forEach((row) => {
              $tr = $('<tr></tr>');
              row.forEach((value) => {
                let $td = $(`<td>${value}</td>`);
                $td.addClass("text-center");
                let color = {
                  '0': '#e0504c',
                  '1': '#f0cc39',
                  '2': '#7cd071',
                  'NONE': '#e7e7e7'
                }
                $td.css("background-color", color[value]);
                $tr.append($td);
              });
              $tbody.append($tr);
            });
            $table.append($tbody);

            $('#table thead th').each(function () {
              $(this).append('<input type="text" placeholder="Search"/>');
            });

            let datatable = $('#table').DataTable({"dom": 'lrtip'});
            datatable.columns().every(function () {
              let that = this;
              $('input', this.header()).on('keyup change', function () {
                if (that.search() !== this.value) {
                  that.search(this.value).draw();
                }
              });
              return true;
            });
          }
        });
      }
    }
  },
  validate(filters) {
    const errors = [];
    if (!filters.date_from) {
      errors.push(t('report.snapshot.messages.validation.required', {field: t('report.snapshot.search.date-from')}));
    }
    if (!filters.date_to) {
      errors.push(t('report.snapshot.messages.validation.required', {field: t('report.snapshot.search.date-to')}));
    }
    return errors;
  }
});
