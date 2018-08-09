import Bn from 'backbone';
import env from '../env';

export default Bn.Model.extend({
  urlRoot: `${env.API}/organizations`,
  validate() {
    const errors = [];

    if (this.attributes.name === '') {
      errors.push(t('organization.form.name-required'));
      return errors;
    }

    if (this.attributes.name.length > 50) {
      errors.push(t('organization.form.name-length-exceeded'));
      return errors;
    }

    if (this.attributes.code === '') {
      errors.push(t('organization.form.code-required'));
      return errors;
    }

    if (this.attributes.code.length > 50) {
      errors.push(t('organization.form.code-length-exceeded'));
      return errors;
    }

    if (this.attributes.description === '') {
      errors.push(t('organization.form.description-required'));
      return errors;
    }

    if (this.attributes.description.length > 256) {
      errors.push(t('organization.form.description-length-exceeded'));
      return errors;
    }

    if (
      this.attributes.information !== '' &&
      this.attributes.information.length > 256
    ) {
      errors.push(t('organization.form.information-length-exceeded'));
      return errors;
    }

    return errors.length > 0 ? errors : undefined;
  }
});
