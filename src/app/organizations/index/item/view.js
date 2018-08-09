import Bn from 'backbone';
import Mn from 'backbone.marionette';
import Template from './template.hbs';

export default Mn.View.extend({
  template: Template,
  triggers: {
    'click .card-menu-delete': 'delete:model'
  },
  events: {
    'click .card-menu-edit': 'editOrganization'
  },
  serializeData() {
    return {
      organization: this.model.attributes,
      logoUrl:
        this.model.get('logoUrl') || '/static/images/icon_logo_place.png',
      isRoot: this.isRoot()
    };
  },
  editOrganization(event) {
    event.preventDefault();
    if (this.isRoot()) {
      return;
    }
    Bn.history.navigate(`/organizations/edit/${this.model.get('id')}`, true);
  },
  isRoot() {
    return this.options.isRoot;
  }
});
