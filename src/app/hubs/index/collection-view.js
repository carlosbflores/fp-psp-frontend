import Mn from 'backbone.marionette';
import ItemView from './item/view';
import Model from '../model';
import FlashesService from '../../flashes/service';
import ModalService from '../../modal/service';

export default Mn.CollectionView.extend({
  childView: ItemView,
  childViewOptions: {
    className: 'col-lg-2 col-md-4 col-sm-6 col-xs-12'
  },
  className: 'list-container row',
  childViewEvents: {
    'delete:model': 'onChildDeleteModel'
  },
  onRender() {
    this.$el.find('#search').focus();
  },
  onChildDeleteModel(childView) {
    let self = this;

    ModalService.request('confirm', {
      title: t('hub.delete.confirm-title'),
      text: t('hub.delete.confirm-text')
    }).then(confirmed => {
      if (!confirmed) {
        return;
      }

      let model = new Model();
      model.set('id', childView.model.get('id'));
      model.destroy({
        success() {
          self.collection.remove(childView.model);
          FlashesService.request('add', {
            timeout: 2000,
            type: 'info',
            title: t('hub.delete.success')
          });
        },
        error() {
          FlashesService.request('add', {
            timeout: 2000,
            type: 'danger',
            title: t('hub.delete.failed')
          });
        }
      });
    });
  }
});
