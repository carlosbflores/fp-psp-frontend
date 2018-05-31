import OrganizationsView from './index/layout-view';
import HubView from './index/hubs/layout-view';
import OrganizationView from './show/view';
import OrganizationFormView from './add/view';
import organizationsStorage from './storage';
import OrganizationDashboard from './dashboard/model';
import NewUserView from '../users/add/view';

const organizations = props => {
  const {app} = props;
  const routes = {
    appRoutes: {
      'collaborators(/:entity)': 'showHubs',
      'collaborators(/:entity)/:id': 'showOrganizationsByApplication',
      'management/organizations(/)': 'showOrganizations',
      'organizations(/)': 'showOrganizations',
      'management/organizations/new': 'newOrganization',
      'management/organizations/edit/:id': 'editOrganization',
      'organizations/:id(/:entity)': 'showOrganization',
      'management/organizations/:id(/:entity)': 'showOrganization',
      'organizations/:id(/:entity)/new': 'showUsersForm'
    },
    controller: {
      // paginated organizations
      showHubs(entity) {
        app.showViewOnRoute(new HubView({app, entity}));
      },
      showOrganizations() {
        app.showViewOnRoute(new OrganizationsView({app}));
      },
      showOrganizationsByApplication(entity, applicationId) {
        app.showViewOnRoute(new OrganizationsView({app, applicationId}));
      },
      showOrganization(organizationId, entity) {
        // show the organization dashboard
        const model = new OrganizationDashboard();
        model
          .fetch({
            data: {
              organizationId
            }
          })
          .then(() => {
            app.showViewOnRoute(
              new OrganizationView({
                model,
                app,
                entity,
                organizationId
              })
            );
          });
      },
      newOrganization() {
        app.showViewOnRoute(new OrganizationFormView({app}));
      },
      editOrganization(organizationId) {
        organizationsStorage.find(organizationId).then(model => {
          app.showViewOnRoute(new OrganizationFormView({model, app}));
        });
      },
      showUsersForm() {
        app.showViewOnRoute(new NewUserView({app}));
      }
    }
  };
  return routes;
};

export default organizations;
