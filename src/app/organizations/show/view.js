import Mn from 'backbone.marionette';
import $ from 'jquery';
import c3 from 'c3';
import 'datatables.net-bs';
import Template from './template.hbs';
import FamiliesView from '../../families/index/layout-view';
import storage from '../storage';
import ActivityFeed from '../activities/collection';
import FeedItem from '../activities/item/view';

export default Mn.View.extend({
  template: Template,
  initialize(options) {
    this.app = options.app;
    this.entity = options.entity;
    this.organizationId = options.organizationId;
    this.organization = this.model.attributes;
  },
  onRender() {
    let headerItems;
    if (this.app.getSession().userHasRole('ROLE_ROOT')) {
      headerItems = storage.getUserSubHeaderItems(this.model);
    } else if (this.app.getSession().userHasRole('ROLE_HUB_ADMIN')) {
      headerItems = storage.getHubAdminHeaderItems(this.model);
    } else {
      headerItems = storage.getSubHeaderItems(this.model);
    }
    this.app.updateSubHeader(headerItems);

    if (this.app.getSession().userHasRole('ROLE_APP_ADMIN')) {
      $('a[href$="organizations"]')
        .parent()
        .addClass('subActive');
    } else {
      $('#sub-header .navbar-header > .navbar-brand').addClass('subActive');
    }

    this.renderFeed();

    setTimeout(() => {
      this.chart();
      this.dataTables();
    }, 0);
  },

  renderFeed() {
    this.activities = new ActivityFeed();
    this.activities.fetch({
      success: () => {
        const activityFeed = this.$el.find('#activity-feed-hub');
        activityFeed.empty();
        this.activities.each(model => {
          const item = new FeedItem({ model });
          activityFeed.append(item.render().el);
        });
      }
    });
  },

  dataTables() {
    $('#table-top-indicators').dataTable({
      lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'All']],
      searching: false,
      paging: true,
      lengthChange: true,
      info: false,
      order: [[1, 'desc'], [2, 'desc'], [3, 'desc']]
    });
  },
  chart() {
    c3.generate({
      bindto: '#bar-indicators',
      data: {
        columns: [
          [
            'Red',
            `${
              this.organization.dashboard.snapshotIndicators
                .count_red_indicators
            }`
          ],
          [
            'Yellow',
            `${
              this.organization.dashboard.snapshotIndicators
                .count_yellow_indicators
            }`
          ],
          [
            'Green',
            `${
              this.organization.dashboard.snapshotIndicators
                .count_green_indicators
            }`
          ]
        ],
        colors: {
          Red: 'rgba(255, 0, 0, 0.8)',
          Yellow: 'rgba(255, 255, 0, 0.7)',
          Green: 'rgba(0, 128, 0, 0.7)'
        },
        names: {
          Red: `${t('general.red')}:  ${
            this.organization.dashboard.snapshotIndicators.count_red_indicators
          }`,
          Yellow: `${t('general.yellow')}: ${
            this.organization.dashboard.snapshotIndicators
              .count_yellow_indicators
          }`,
          Green: `${t('general.green')}: ${
            this.organization.dashboard.snapshotIndicators
              .count_green_indicators
          }`
        },
        type: 'donut'
      },
      donut: {
        width: 50
      },
      size: {
        height: 250
      }
    });
  },
  getTemplate() {
    if (this.entity === 'families') {
      let organizationId = this.organizationId;
      this.app.showViewOnRoute(
        new FamiliesView({
          organizationId,
          app: this.app
        })
      );
      return this.$el.html('');
    }
    return Template;
  },
  serializeData() {
    return {
      organization: this.model.attributes
    };
  }
});
