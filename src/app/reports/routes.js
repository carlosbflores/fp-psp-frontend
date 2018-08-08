import View from './view';

const reportForm = props => {
  const { app } = props;
  const routes = {
    appRoutes: {
      reports: 'showReportForm'
    },
    controller: {
      showReportForm() {
        app.showViewOnRoute(new View({ app }));
      }
    }
  };
  return routes;
};

export default reportForm;
