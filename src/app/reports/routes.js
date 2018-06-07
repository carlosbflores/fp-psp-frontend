import FamilyOrganizationView from './snapshots/by_organization/view';
import DatatableReportView from './datatables/view';

const reports = props => {
  const {app} = props;
  const routes = {
    appRoutes: {
      'reports/snapshots/organizations(/)': 'showFamiliesByOrganization',
      'reports/datatable': 'datatableReport'
    },
    controller: {
      showFamiliesByOrganization() {
        app.showViewOnRoute(new FamilyOrganizationView({app}));
      },
      datatableReport() {
        app.showViewOnRoute(new DatatableReportView({app}));
      }
    }
  };
  return routes;
};

export default reports;
