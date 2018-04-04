import UsersView from './view';
import NewUserView from '../users/add/view';

const users = props => {
  const {app} = props;

  const routes = {
    appRoutes: {
      'users(/)': 'showUsers',
      'users/new': 'newUser',
    },
    controller: {
      showUsers() {
        app.showViewOnRoute(new UsersView({app}));
      },
      newUser() {
        app.showViewOnRoute(new NewUserView({app}));
      }
    }
  };

  return routes;
};

export default users;
