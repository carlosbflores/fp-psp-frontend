import Mn from 'backbone.marionette';
import React from 'react';
import ReactDOM from 'react-dom';
import Template from './template.hbs';
import SurveyCollection from './collection';
import FormContainer from '../components/reportForm/formContainer';

export default Mn.View.extend({
  template: Template,
  initialize(app) {
    this.app = app.app;
    this.collection = new SurveyCollection();
  },
  onRender() {
    this.getSurveys();
  },
  renderForm(surveyData) {
    const reportForm = this.$el.find('#report-form')[0];
    this.reactView = React.createElement(FormContainer, {
      surveyData
    });
    ReactDOM.unmountComponentAtNode(reportForm);
    ReactDOM.render(this.reactView, reportForm);
  },
  getSurveys() {
    let self = this;
    this.collection
      .fetch({
        success(response) {
          self.surveyData = response.models.map(item => item.attributes);
          return self.surveyData;
        }
      })
      .then(surveyData => self.renderForm(surveyData));
  }
});
