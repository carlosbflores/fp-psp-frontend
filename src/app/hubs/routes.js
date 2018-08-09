import HubsView from './index/layout-view';
import hubsStorage from './storage';
import HubFormView from './add/view';

const hubs = props => {
  const { app } = props;
  const routes = {
    appRoutes: {
      'hubs(/)': 'showHubs',
      'hubs/new': 'newHub',
      'hubs/edit/:id': 'editHub'
    },
    controller: {
      showHubs() {
        app.showViewOnRoute(new HubsView({ app }));
      },
      newHub() {
        app.showViewOnRoute(new HubFormView({ app }));
      },
      editHub(applicationId) {
        hubsStorage.find(applicationId).then(model => {
          app.showViewOnRoute(new HubFormView({ model, app }));
        });
      }
    }
  };
  return routes;
};

export default hubs;
