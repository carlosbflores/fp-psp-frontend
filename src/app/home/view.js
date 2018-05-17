import Mn from 'backbone.marionette';
import Bb from 'backbone';
import c3 from 'c3';
import $ from 'jquery';
import _ from 'lodash';
import moment from 'moment';
import Template from './template.hbs';
import session from '../../common/session';
import storage from '../management/hubs/storage';

export default Mn.View.extend({
  template: Template,

  initialize(options) {
    this.app = options.app;

    if (this.model) {
      this.organization = this.model.attributes;
      setTimeout(() => {
        let logo = this.model.attributes.logoUrl || '/static/images/icon_logo_place.png';
        $('#sub-header-image').attr('src' ,logo)
      if(!$.isEmptyObject(this.organization.dashboard.snapshotTaken.byMonth)){
          $('.no-data').hide();
          this.chart();
        }
      }, 0);
    }
  },

  onRender() {
    if (this.model.get('id')) {
      this.app.updateSubHeader(storage.getSubHeaderItems(this.model));
    }

  },

  formatDate(key){
    return moment(key).locale(session.get('locale')?session.get('locale'):'es').format('MMMM');
  },

  generateData(){
     let snapshots = this.sortData(this.organization.dashboard.snapshotTaken.byMonth);
     let data={};
     data.x = [
      'x',
       ... _.keys(snapshots).map(key => this.formatDate(key))
    ];
    data.data1 = [
        'data1',
        ... _.values(snapshots)
    ];



    return data;
  },

  sortData(data){
    return Object.keys(data)
    .sort()
    .reduce((result, key) => {
       result[key] = data[key];
       return result;
   }, {});
  },

  chart(){
    const data = this.generateData();
    c3.generate({
        bindto: '#bar-snapshots-taken',
        data: {
           x: 'x',
          columns: [
            data.x,
            data.data1,
          ],
          names: {
            data1: t('home.snapshots-taken'),
          },
          colors:{
                data1: '#60b4ef',
              },
          type: 'line',
          labels: true,
          empty: {
            label: {
              text: t('home.no-data')
            }
          }
        },
        axis: {
            x: {
                type: 'category'
            },
            y: {
               show: true
             }
        },
        bar: {
         width: {
             ratio: 0.6
            }
         },
        size: {
            height: 200
          },
        legend: {
            show: false
          }
    });
  },

  serializeData() {
    if (!this.model) {
      this.model = new Bb.Model();
    }
    return {
      organization: this.model.attributes
    };
  }
});
