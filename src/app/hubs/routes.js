import ApplicationsView from './index/layout-view';
import NewApplicationView from './add/view';

const applications = props => {
  const {app} = props;
  const routes = {
    appRoutes: {
      'applications(/)': 'showApplications',
      'applications/new': 'newApplication'
    },
    controller: {
      showApplications() {
        app.showViewOnRoute(new ApplicationsView({app}));
      },
      newApplication() {
        app.showViewOnRoute(new NewApplicationView({app}));
      }
    }
  };
  return routes;
};

export default applications;
