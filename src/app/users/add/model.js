import Bn from 'backbone';
import env from '../../env';

export default Bn.Model.extend({
  urlRoot: `${env.API}/users/addUserRoleApplication`,
  validate() {
    const errors = [];

    if (this.attributes.username === '') {
      errors.push(t('user.form.username-required'));
      return errors;
    }

    if (this.attributes.email === '') {
      errors.push(t('user.form.email-required'));
      return errors;
    }

    const emailRegExp = /^[a-zA-Z0-9._-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

    if (!emailRegExp.test(this.attributes.email)) {
      errors.push(t('user.form.email-not-valid'));
      return errors;
    }

    if (this.attributes.pass === '') {
      errors.push(t('user.form.password-required'));
      return errors;
    }

    if (this.attributes['password-confirm'] === '') {
      errors.push(t('user.form.password-confirm-required'));
      return errors;
    }

    if (this.attributes.pass !== '' && this.attributes['password-confirm'] !== '' &&
      this.attributes.pass !== this.attributes['password-confirm']) {
      errors.push(t('user.form.password-confirm-failed'));
      return errors;
    }

    if (!this.attributes.application && !this.attributes.organization) {
      errors.push(t('user.form.select-organization-required'));
      return errors;
    }

    if (!this.attributes.role) {
      errors.push(t('user.form.select-role-required'));
      return errors;
    }

    return errors.length > 0 ? errors : undefined;
  }
});
