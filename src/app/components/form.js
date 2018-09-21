import React, {Component} from 'react';
import JsonSchemaForm from 'react-jsonschema-form';
import Gallery from './gallery';
import Gmap from './gmap';
import NumberFormat from './number';
import DatetimeFormat from './datetime';
import FlashesService from "../flashes/service";

const log = type => console.log.bind(console, type);

class Form extends Component {
  constructor(props) {
    super(props);

    let order = props.uiSchema['ui:order'];
    let stepsSchema = [];
    let stepsUISchema = [];

    this.counter = {
      countEconomic: 0,
      countIndicator: 0,
      countPersonal: 0
    };

    let component = this;
    let dependencies = {};

    for (let i = 0; i < order.length; i++) {
      stepsSchema.push(component.schemaNewEntry(props.schema, order[i]));
      stepsUISchema.push(component.uischemaNewEntry(props.uiSchema, order[i]));

      if (props.schema.dependencies &&
        props.schema.dependencies[order[i]]){
        dependencies[order[i]] = {};
      }
    }

    if (props.reAnswer) {
      this.state = {
        step: 0,
        formData: props.formData,
        stepsSchema,
        stepsUISchema,
        lastValue: {}
      };

    } else if (!props.stateDraft) {
      this.state = {
        step: 0,
        formData: {},
        stepsSchema,
        stepsUISchema,
        lastValue: {}
      };
      // empty dependencies only if it is a new snaphot
      this.state.formData.dependencies = dependencies;
    } else {
      // If the survey definition was changed, we should update this.state.
      this.updateState(stepsSchema, stepsUISchema);

    }

    this.onSubmit = this.onSubmit.bind(this);
  }

  getAllDependenciesKeys(formDataDependencies){
    let arrayDependenciesKeys = [];
    if (formDataDependencies) {
      Object.keys(formDataDependencies).forEach(key => {
        arrayDependenciesKeys.push(...Object.keys(formDataDependencies[key]));
      })
    }
    arrayDependenciesKeys.push('dependencies');
    return arrayDependenciesKeys;
  }

  updateState(stepsSchema, stepsUISchema) {
    stepsSchema.forEach(item => {
      if (item.dependencies && item.dependencies !== null){
        let formData = this.props.stateDraft.formData;
        let selected = formData[item.key];
        if (item.dependencies[item.key]) {
          let dependency = item.dependencies[item.key];
          // There can be other types of dependency, for now everithing related
          // to enum is covered
          if (dependency.oneOf) {
            this.manageDependencyForEnums(dependency,selected,formData, item);
          }
        }
      }
    });

    this.state = {
      step: this.getSavedDraftStep(stepsSchema),
      formData: this.props.stateDraft.formData,
      stepsSchema,
      stepsUISchema,
      lastValue: this.props.stateDraft.formData
    };
  }

  getSavedDraftStep(stepsSchema) {
    const stepKey = this.props.stateDraft.stepsSchema[this.props.stateDraft.step].key;
    let indexActualKey = -1;
    let firstIndexNotFound = -1;

    // Case2: the fields order were changed.

    for (let i = 0; i < stepsSchema.length; i++) {
      if (stepsSchema[i].key === stepKey) {
        indexActualKey = i;
      }

      // Case 3: the field wasn't answered (for example, changed from optional to required).
      // stepsSchema[i].required.length>0 &&
      if (firstIndexNotFound === -1 && this.props.stateDraft.formData[stepsSchema[i].key] === undefined) {
        firstIndexNotFound = i;
      }
    }

    if (indexActualKey !== -1) {
      if (this.props.stateDraft.step + 1 >= indexActualKey) {
        return indexActualKey;
      }
      return firstIndexNotFound;
    }
    return this.props.stateDraft.step;

  }

  existInSchemaGroup(field) {
    return this.props.uiSchema['ui:group:personal'].includes(field) ||
      this.props.uiSchema['ui:group:economics'].includes(field) ||
      this.props.uiSchema['ui:group:indicators'].includes(field);
  }

  uischemaNewEntry(uischema, key) {
    var uischemaToRet = {};
    uischemaToRet.key = key;
    uischemaToRet.properties = {};

    uischemaToRet['ui:group:economics'] = [];
    uischemaToRet['ui:group:indicators'] = [];

    if (uischema.properties && uischema.properties[key]) {
      uischemaToRet.properties[key] = uischema.properties[key];
    }
    if (uischema['ui:custom:fields'] && uischema['ui:custom:fields'][key]) {
      uischemaToRet[key] = uischema['ui:custom:fields'][key];

    }

    if (
      uischema['ui:group:economics'] &&
      uischema['ui:group:economics'].includes(key)
    ) {
      uischemaToRet['ui:group:economics'].push(key);
    }
    if (
      uischema['ui:group:indicators'] &&
      uischema['ui:group:indicators'].includes(key)
    ) {
      uischemaToRet['ui:group:indicators'].push(key);
    }

    if (
      uischema['ui:group:personal'] &&
      uischema['ui:group:personal'].includes(key)
    ) {
      if (this.props.reAnswer || (this.props.stateDraft && this.props.stateDraft.reAnswer)) uischemaToRet[key] = {"ui:readonly": true};
    }

    return uischemaToRet;
  }

  schemaNewEntry(schema, key) {
    var schemaToRet = JSON.parse(JSON.stringify(schema));
    schemaToRet.key = key;
    schemaToRet.properties = {};
    schemaToRet.required = [];
    schemaToRet.properties[key] = schema.properties[key];

    if (schema.required && schema.required.includes(key)) {
      schemaToRet.required.push(key);
    }

    if (schema.dependencies && schema.dependencies.key){
      schemaToRet.dependencies.key = schema.dependencies.key;
    }

    if (
      this.props.uiSchema['ui:group:economics'] &&
      this.props.uiSchema['ui:group:economics'].includes(key)
    ) {
      this.counter.countEconomic++;
      schemaToRet.description = `${t('schemaForm.economic-info')} ${
        this.counter.countEconomic
        }/`;
      schemaToRet.counter = 'countEconomic';
    }
    if (
      this.props.uiSchema['ui:group:indicators'] &&
      this.props.uiSchema['ui:group:indicators'].includes(key)
    ) {
      this.counter.countIndicator++;
      schemaToRet.counter = 'countIndicator';
      schemaToRet.description = `${t('schemaForm.indicators')} ${this.counter.countIndicator}/`;
    }
    if (
      this.props.uiSchema['ui:group:personal'] &&
      this.props.uiSchema['ui:group:personal'].includes(key)
    ) {
      this.counter.countPersonal++;
      schemaToRet.counter = 'countPersonal';
      schemaToRet.description = `${t('schemaForm.personal-info')} ${
        this.counter.countPersonal
        }/`;
    }
    return schemaToRet;
  }

  onSubmit(data) {
    let required = this.props.schema.required;
    let schemaPersonalGroup = this.props.uiSchema['ui:group:personal'];
    let schemaEconimicsGroup = this.props.uiSchema['ui:group:economics'];
    let schemaIndicatorsGroup = this.props.uiSchema['ui:group:indicators'];

    var currentStep = this.state.stepsSchema[this.state.step];

    if ((schemaPersonalGroup.includes(currentStep.key) || schemaEconimicsGroup.includes(currentStep.key))
          && required.includes(currentStep.key)
          && data.formData[currentStep.key] === undefined) {
      FlashesService.request('add', {
        timeout: 3000,
        type: 'warning',
        title: t('schemaForm.errors.required')
      });
      return;
    }

    if (schemaIndicatorsGroup.includes(currentStep.key)
          && data.formData[currentStep.key] === undefined) {
      FlashesService.request('add', {
        timeout: 3000,
        type: 'warning',
        title: t('schemaForm.select-an-option')
      });
      return;
    }

    let newData = JSON.parse(JSON.stringify(this.state.formData));
    newData[currentStep.key] = data.formData[currentStep.key];

    if (this.state.step < this.state.stepsSchema.length - 1) {
      this.setState({
        step: this.state.step + 1,
        formData: newData,
        lastValue: newData

      });
    } else {
      this.setState({
        formData: newData,
        lastValue: newData
      });
      this.onSubmit = this.props.handleSubmit(newData, this.props.draftId);
    }
  }

  onCancel() {
    // $('panel-danger').empty();
    var newData = JSON.parse(JSON.stringify(this.state.formData));
    this.state.stepsSchema[this.state.step];


    if (this.state.step > 0) {
      this.setState({
        step: this.state.step - 1,
        formData: newData,
        lastValue: newData
      });
    } else {
      this.setState({
        formData: {},
        lastValue: {}
      });
      this.props.handleCancel();
    }

  }

  onSaveDraft() {
    // When a survey has not been completed and we want to save a draft
    // , the method handleSaveDraft is called.

    if (this.checkShowSaveDraft(this.state)) {

      // We should obtain an actual data in the form for
      // store in the draft

      let newData = JSON.parse(JSON.stringify(this.state.formData));
      let currentStep = this.state.stepsSchema[this.state.step];

      newData[currentStep.key] = this.state.lastValue[currentStep.key];

      this.state.formData = newData;
      this.state.reAnswer = ((this.props.stateDraft && this.props.stateDraft.reAnswer) || this.props.reAnswer);
      this.props.handleSaveDraft(this.state);

    } else {
      this.render();
    }
  }

  checkShowSaveDraft(state) {
    let show = true;

    if (this.props.uiSchema['ui:group:personal'].length === 0) {
      show = false;
    } else if (!state.formData) {
      show = false;
    } else {
      for (let i = 0; i < this.props.uiSchema['ui:group:personal'].length; i++) {
        if (this.props.uiSchema['ui:order'][state.step] === this.props.uiSchema['ui:group:personal'][i]) {
          show = false;
        }
      }
    }

    return show;
  }

  onChange(data) {

    const {
      formData
      , schema
    } = data;

    if (!schema.dependencies || schema.dependencies===null){
      return;
    }

    let selected = formData[schema.key];
    if (schema.dependencies[schema.key]) {

      let dependency = schema.dependencies[schema.key];
      // se pueden dar otro tipos de dependency, por ahora cubierto t0do lo que sea enum
      if (dependency.oneOf) {
        this.manageDependencyForEnums(dependency,selected,formData, schema);
      }
    }

    this.setState({formData: {}, schema: {}});
    this.state.schema;
    this.setState({
      schema,
      formData,
      lastValue: formData
    });

  }

  manageDependencyForEnums(dependency, selected, formData, schema){

    dependency.oneOf.forEach((item) => {
      let values = item.properties[schema.key].enum;
      if (values.includes(selected)) {

        // required fields (from properties)
        if (schema.required && schema.required.includes(schema.key)){
          schema.required = [schema.key];
        }else{
          schema.required = [];
        }

        // if there are required dependencies
        if (item.required) {
          schema.required.push(...item.required);
        }

        const defaultProperty = schema.properties[schema.key];
        const defaultValue = formData[schema.key];

        // delete old setup
        schema.properties = {};

        // preserve in schema and formData only original property values
        schema.properties[schema.key] = defaultProperty;
        formData[schema.key] = defaultValue;

        // set the new properties from dependencies
        let newProperties = JSON.parse(JSON.stringify(item.properties));

        Object.keys(formData.dependencies[schema.key]).forEach(key => {
          if (!newProperties[key]){
            delete formData[key];
          }
        })

        delete newProperties[schema.key];
        let length = Object.keys(newProperties).length;

        formData.dependencies[schema.key] = {};
        if (length > 0) {
          formData.dependencies[schema.key][schema.key] = selected;
          schema.properties = Object.assign(schema.properties, newProperties);
            Object.keys(newProperties).forEach(key => {
              // formData.dependencies[schema.key].push(key);
              formData.dependencies[schema.key][key] = formData[key];
            })
        }

      }
    });



  }

  mapErrors(errors) {
    return errors.map(error => {
      if (error.name === 'required') {
        error.message = t('schemaForm.errors.required');
      }
      if (error.name === 'format' && error.argument === 'date') {
        error.message = t('schemaForm.errors.format.date');
      }
      if (error.name === 'format' && error.argument === 'email') {
        error.message = t('schemaForm.errors.format.email');
      }
      return error;
    });
  }


  render() {
    // TODO draft-feature
    return (
      <div className="col-md-12">
        {this.checkShowSaveDraft(this.state) ?
          <button
            className="btn btn-primary pull-right marginDraft"
            onClick={() => this.onSaveDraft()}
          > {t('schemaForm.buttons.save-draft')}
          </button> : ''}

        <article className="card">
          <div className="card-block">
            <div id="new-survey-2" className="row">
              <div className="col-md-12 survey-container">
                <label className="progress-survey">
                  {' '}
                  {this.state.stepsSchema[this.state.step].description}
                  {this.counter[this.state.stepsSchema[this.state.step].counter]}
                </label>
                <hr className="progress-rule" />
                <JsonSchemaForm
                  schema={this.state.stepsSchema[this.state.step]}
                  uiSchema={this.state.stepsUISchema[this.state.step]}
                  fields={{gallery: Gallery, gmap: Gmap, numberFormat: NumberFormat, date: DatetimeFormat}}
                  onSubmit={this.onSubmit}
                  onError={log('errors')}
                  formData={this.state.formData}
                  onChange={(event) => {
                    this.onChange(event)
                  }}
                  transformErrors={this.mapErrors}
                  noHtml5Validate
                  showErrorList={false}
                >
                  <button
                    type="button"
                    onClick={() => this.onCancel(this.state.formData)}
                    className="btn btn-circle survey-previous"
                  >
                    <i className="fa fa-chevron-left" />
                  </button>
                  <button type="submit" className="btn btn-circle survey-next">
                    <i className="fa fa-chevron-right" />
                  </button>
                </JsonSchemaForm>

              </div>
            </div>
          </div>
        </article>
      </div>

    );
  }
}

export default Form;
