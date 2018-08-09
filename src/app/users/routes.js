import UsersView from './view';
import NewUserView from '../users/add/view';
import UsersStorage from './storage';

const users = props => {
  const { app } = props;

  const routes = {
    appRoutes: {
      users: 'showUsers',
      'users/new': 'newUser',
      'users/edit/:userId': 'editUser'
    },
    controller: {
      showUsers() {
        app.showViewOnRoute(new UsersView({ app }));
      },
      newUser() {
        app.showViewOnRoute(new NewUserView({ app }));
      },
      editUser(userId) {
        UsersStorage.find(userId).then(model => {
          app.showViewOnRoute(new NewUserView({ model, app }));
        });
      }
    }
  };

  return routes;
};

export default users;
