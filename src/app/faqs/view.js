import Mn from 'backbone.marionette';
import TemplateES from './template_es.hbs';
import TemplateEN from './template_en.hbs';
import session from '../../common/session';

export default Mn.View.extend({
  
  template: TemplateEN,

  initialize() {    
    this.template = this.getLocale();
  },

  getLocale(){
    return session.get('locale').indexOf('es') !== -1 ? TemplateES : TemplateEN
  }

});