import Bn from 'backbone';
import Mn from 'backbone.marionette';
import Template from './template.hbs';

export default Mn.View.extend({
  template: Template,
  triggers: {
    'click .card-menu-delete': 'delete:model'
  },
  events: {
    'click .card-menu-edit': 'editHub'
  },
  serializeData() {
    return {
      hub: this.model.attributes,
      logoUrl: this.model.get('logoUrl') || '/static/images/icon_logo_hub.png'
    };
  },
  editHub(event) {
    event.preventDefault();

    Bn.history.navigate(`/hubs/edit/${this.model.get('id')}`, true);
  }
});
