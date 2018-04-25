import FamiliesView from './index/layout-view';
import FamilyView from './show/view';
import FamilySnapshotListView from './show/snapshot/list/view';
import FamilySnapshotView from './show/snapshot/view';
import familiesStorage from './storage';
import SnapshotItemModel from '../snapshots/list/item/model';
import FamilyUserView from './user/view';
import FamilyForm from './edit/view';

const families = props => {
  const { app } = props;
  const routes = {
    appRoutes: {
      'families(/)': 'showFamilies',
      'families/:id/edit': 'editFamily',
      'families/:id(/:entity)': 'showFamily',
      'families/:id/snapshots(/:snapshotId)': 'showSnapshotFamily'
    },
    controller: {
      showFamilies() {
        if (app.getSession().userHasRole('ROLE_SURVEY_USER') ||app.getSession().userHasRole('ROLE_USER')) {
          app.showViewOnRoute(new FamilyUserView({ app }));
        }else{
          app.showViewOnRoute(new FamiliesView({ app }));
        }
      },
      showFamily(familyId, entity) {
        familiesStorage.find(familyId).then(model => {
          if (entity === 'snapshots') {
            app.showViewOnRoute(
              new FamilySnapshotListView({
                model,
                app,
                entity
              })
            );
          } else {
            app.showViewOnRoute(
              new FamilyView({
                model,
                app,
                entity
              })
            );
          }
        });
      },
      showSnapshotFamily(familyId, snapshotId) {
        const snapshotModel = new SnapshotItemModel();
        snapshotModel
          .fetch({
            data: {
              snapshot_id: snapshotId
            }
          })
          .then(() => {
            familiesStorage.find(familyId).then(model => {
              app.showViewOnRoute(
                new FamilySnapshotView({
                  model,
                  app,
                  snapshotId,
                  snapshotModel
                })
              );
            });
          });
      },
      editFamily(familyId) {
        familiesStorage.find(familyId).then(model => {
          app.showViewOnRoute(new FamilyForm({model}));
        });
      }
    }
  };
  return routes;
};

export default families;
