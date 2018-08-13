import React from 'react';
import camelCasetoWords from '../utils.js';
import SelectWithTags from './selectWithTags';

export default class FormContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSurvey: '',
      indicators: [],
      organizations: [],
      selectedOrganizations: []
    };

    this.getIndicators = this.getIndicators.bind(this);
    this.getOrganizations = this.getOrganizations.bind(this);
    this.selectSurvey = this.selectSurvey.bind(this);
    this.selectOrganization = this.selectOrganization.bind(this);
    this.deselectOrganization = this.deselectOrganization.bind(this);
  }

  componentDidMount() {
    this.selectDefaultSurvey();
  }

  getSurveys(data) {
    return data.map(item => item.title);
  }

  selectDefaultSurvey() {
    if (this.props.surveyData && this.state.selectedSurvey === '') {
      this.setState({
        selectedSurvey: this.props.surveyData[0].title
      });
      this.getIndicators(this.props.surveyData[0].title);
      this.getOrganizations(this.props.surveyData[0].title);
    }
  }

  selectSurvey(survey) {
    this.setState({
      selectedSurvey: survey
    });
    this.getIndicators(survey);
    this.getOrganizations(survey);
  }

  selectOrganization(organization) {
    this.setState({
      selectedOrganizations: [
        ...this.state.selectedOrganizations,
        this.state.organizations.filter(item => item.name === organization)[0]
      ]
    });
  }

  deselectOrganization(organization) {
    this.setState({
      selectedOrganizations: this.state.selectedOrganizations.filter(
        item => item.name !== organization
      )
    });
  }
  getOrganizations(survey) {
    const organizations = this.props.surveyData
      ? this.props.surveyData.filter(item => item.title === survey)[0]
          .organizations
      : [];
    this.setState({
      organizations
    });
  }

  getIndicators(survey) {
    const indicators = this.props.surveyData
      ? this.props.surveyData.filter(item => item.title === survey)[0]
          .survey_ui_schema['ui:group:indicators']
      : [];
    this.setState({
      indicators
    });
  }

  render() {
    return (
      <div>
        <label>Organization</label>
        <SelectWithTags
          items={this.state.organizations.filter(
            item => !this.state.selectedOrganizations.includes(item)
          )}
          selectedItems={this.state.selectedOrganizations}
          selectMethod={this.selectOrganization}
          deselectMethod={this.deselectOrganization}
        />
        <label>Survey</label>
        <select
          className="map-select"
          onChange={e => this.selectSurvey(e.target.value)}
        >
          {this.getSurveys(this.props.surveyData).map(item => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <hr />
        <label>Indicators</label>
        {this.state.indicators.map(item => (
          <div key={item}>
            <input type="checkbox" id={item} name={item} value={item} />
            <label>{camelCasetoWords(item)}</label>
          </div>
        ))}
        <hr />
        <button className="btn btn-primary">Download Reports</button>
      </div>
    );
  }
}
