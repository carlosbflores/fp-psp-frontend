/* eslint no-prototype-builtins: 0 */
/* eslint camelcase: 0 */

import _ from 'lodash';
import $ from 'jquery';
import Bn from 'backbone';
import Mn from 'backbone.marionette';
import React from 'react';
import ReactDOM from 'react-dom';
import storage from '../storage';
import Template from './template.hbs';
import Form from '../../components/form';
import SurveyModel from '../../surveys/add/model';
import SnapshotModel from './model';
import SnapshotDraftModel from '../../snapshots_drafts/model';
import FlashesService from '../../flashes/service';

export default Mn.View.extend({
  template: Template,

  events: {
    'change #survey-id': 'onSurveySelectChange',
    'click #goback-btn': 'onGoBack'
  },

  initialize(options) {
    const { organizationId, surveyId, handleCancel, app, stateDraft, snapshotDraftId, reAnswer, formData } = options;

    this.surveyModel = new SurveyModel({ id: surveyId });
    this.surveyModel.on('sync', () => this.renderForm());
    this.surveyModel.fetch();

    this.props = {};
    this.props.handleCancel = handleCancel;
    this.props.surveyId = surveyId;
    this.props.organizationId = organizationId;
    this.props.stateDraft = stateDraft;
    this.props.snapshotDraftId = snapshotDraftId;
    this.props.reAnswer = reAnswer;
    this.props.formData = formData;
    this.app = app;
  },

  getLocalizedSchema(unlocalizedSchema) {
    const newSchema = Object.assign({}, unlocalizedSchema);

    const newProps = _.mapValues(newSchema.properties, obj =>
      _.mapValues(obj, obj2 => {
        if (_.isObject(obj2) && obj2.hasOwnProperty('es')) {
          return obj2.es;
        } else if (_.isObject(obj2) && obj2.hasOwnProperty('en')) {
          return obj2.en;
        }
        return obj2;
      })
    );
    newSchema.properties = newProps;
    return newSchema;
  },

  renderForm() {
    const parameters = {};
    parameters.survey_id = this.surveyModel.id;
    parameters.survey_name = this.surveyModel.attributes.title;
    const headerItems = storage.getSubHeaderItems(parameters);
    this.app.updateSubHeader(headerItems);

    const placeHolder = this.$el.find('#new-survey')[0];
    const { survey_schema } = this.surveyModel.attributes;
    const localizedSchema = this.getLocalizedSchema(survey_schema);
    const uiSchema = this.surveyModel.attributes.survey_ui_schema;

    this.reactView = React.createElement(Form, {
      schema: localizedSchema,
      uiSchema,
      handleSubmit: this.hadleSubmit.bind(this),
      handleCancel: this.props.handleCancel,
      handleSaveDraft: this.handleSaveDraft.bind(this),
      view: this,
      stateDraft: this.props.stateDraft,
      reAnswer: this.props.reAnswer,
      formData: this.props.formData,
      draftId: this.props.snapshotDraftId
    });
    ReactDOM.unmountComponentAtNode(placeHolder);
    ReactDOM.render(this.reactView, placeHolder);
  },

  onGoBack() {
    this.props.handleCancel();
  },
  onSurveySelectChange() {
    this.renderForm();
  },
  getPersonal(formData) {
    return _.pick(
      formData,
      this.surveyModel.get('survey_ui_schema')['ui:group:personal']
    );
  },
  getIndicators(formData) {
    return _.pick(
      formData,
      this.surveyModel.get('survey_ui_schema')['ui:group:indicators']
    );
  },
  getEconomics(formData) {
    return _.pick(
      formData,
      this.surveyModel.get('survey_ui_schema')['ui:group:economics']
    );
  },

  fixedGalleryFieldValue(formData) {
    var customFields = this.surveyModel.attributes.survey_ui_schema[
      'ui:custom:fields'
    ];

    $.each(customFields, (i, item) => {
      if (item['ui:field'] && item['ui:field'] === 'gallery') {
        const itemSelected = formData[i];
        if (
          itemSelected &&
          itemSelected !== undefined &&
          Array.isArray(itemSelected)
        ) {
          formData[i] = itemSelected[0].value;
        }
      }
    });
  },

  hadleSubmit(formResult, draftId) {
    // Convert from array to string, using property "value"
    this.fixedGalleryFieldValue(formResult);
    const snapshot = {
      survey_id: this.props.surveyId,
      organization_id: this.props.organizationId,
      personal_survey_data: this.getPersonal(formResult),
      indicator_survey_data: this.getIndicators(formResult),
      economic_survey_data: this.getEconomics(formResult),
      user_name: this.app.getSession().get('user').username,
      term_cond_id: this.app.getSession().get('termCond'),
      priv_pol_id: this.app.getSession().get('priv'),
      dependencies : formResult.dependencies
    };


    new SnapshotModel().save(snapshot).then(savedSnapshot => {

      if(draftId){
        let snapshotDraftModel = new SnapshotDraftModel();
        snapshotDraftModel.set('id', draftId);
        snapshotDraftModel.destroy().then(
          () => {
            this.redirectSummary(savedSnapshot.survey_id, savedSnapshot.snapshot_economic_id);
          },

          error => {
            FlashesService.request('add', {
              timeout: 2000,
              type: 'warning',
               title: error.responseJSON.message
            });
          }

        );
      } else {
        this.redirectSummary(savedSnapshot.survey_id, savedSnapshot.snapshot_economic_id);
      }
    });

    this.app.getSession().save({termCond: 0, priv: 0});
  },

  redirectSummary(surveyId, snapshotEconomicId){
    Bn.history.navigate(
      `/survey/${surveyId}/snapshot/${
        snapshotEconomicId
      }`,
      true
    );
  },

  handleSaveDraft(state){
    let snapshotDraftModel = new SnapshotDraftModel();
    let url = `/surveys`;

    const snapshot = {
      survey_id: this.props.surveyId,
      last_name: state.formData.lastName,
      first_name: state.formData.firstName,
      user_name: this.app.getSession().get('user').username,
      term_cond_id: this.app.getSession().get('termCond'),
      priv_pol_id: this.app.getSession().get('priv'),
      state_draft: state
    }

    if(this.props.snapshotDraftId){
      snapshotDraftModel.set('id', this.props.snapshotDraftId);
      url = `/surveys/drafts`;
    }

    snapshotDraftModel.save(snapshot).then(

      () => {

        FlashesService.request('add', {
          timeout: 2000,
          type: 'info',
          title: t('draft.messages.save-draft')
        });

        Bn.history.navigate(url, true);
      },
      error => {
        FlashesService.request('add', {
          timeout: 2000,
          type: 'warning',
           title: error.responseJSON.message
        });
      }
    );
  }
});
