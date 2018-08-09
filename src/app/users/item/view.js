import Bn from 'backbone';
import Mn from 'backbone.marionette';
import Template from './template.hbs';

export default Mn.View.extend({
  template: Template,
  events: {
    'click .card-menu-edit': 'editUser'
  },
  serializeData() {
    return {
      user: this.model.attributes,
      organizationLabel: this.model.get('organization')
        ? t('user.card.organization')
        : t('user.card.hub'),
      organization:
        this.model.get('organization') || this.model.get('application')
    };
  },
  editUser(event) {
    event.preventDefault();

    Bn.history.navigate(`/users/edit/${this.model.get('userId')}`, true);
  }
});
