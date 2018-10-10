import Mn from 'backbone.marionette';
import moment from 'moment';
import 'moment-timezone';
import session from '../../../../common/session';


import Template from './template.hbs';

export default Mn.View.extend({
  template: Template,
  tagName: 'li',
  className: 'feed-item',

  initialize(options) {
    this.props = Object.assign({}, options);
    this.model = this.props.model;
    this.app = this.props.app;
    this.model.on('sync', this.render);
    console.log(this.model.attributes)
  },

  serializeData() {
    this.model.attributes.message = this.model.attributes.message.replace(/ [e|i]n xx$/g,"")
    return {
      activity: this.model.attributes,
      fromNow: moment(this.model.attributes.createdAt, "YYYYMMDD h:mm:ss a")
      .locale(session.get('locale') ? session.get('locale') : 'es')
      .fromNow()
    };
  }
});
