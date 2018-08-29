/* eslint react/no-unused-state: 0 */

import React from 'react';
import SelectWithTags from './selectWithTags';
import Indicators from './Indicators';
import TimePeriod from './timePeriod';
import env from "../../env";

export default class FormContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSurveyId: null,
      applications: [],
      selectedApplications: [],
      organizations: [],
      selectedOrganizations: [],
      selectedPeriod: [],
      multipleSnapshots: false,
      indicators: [],
      selectedIndicators: {},
    };

    this.selectSurvey = this.selectSurvey.bind(this);
    this.selectApplication = this.selectApplication.bind(this);
    this.deselectApplication = this.deselectApplication.bind(this);
    this.selectOrganization = this.selectOrganization.bind(this);
    this.deselectOrganization = this.deselectOrganization.bind(this);
    this.selectPeriod = this.selectPeriod.bind(this);
    this.toggleMultipleSnapshots = this.toggleMultipleSnapshots.bind(this);
    this.selectIndicator = this.selectIndicator.bind(this);
    this.deselectIndicator = this.deselectIndicator.bind(this);
    this.toggleSelectedColors = this.toggleSelectedColors.bind(this);
  }

  componentDidMount() {
    this.selectDefaultSurvey();
  }

  getSurveys(data) {
    return data.map(item => item);
  }

  selectDefaultSurvey() {
    if (this.props.surveys && this.state.selectedSurveyId === null) {
      let surveyId = this.props.surveys[0].id;
      this.setState({
        selectedSurveyId : surveyId
      });
      this.getApplications(surveyId);
      this.getOrganizations(surveyId);
      this.getIndicators(surveyId);
    }
  }

  selectSurvey(surveyId) {
    this.setState({
      selectedSurveyId: surveyId
    });
    this.getApplications(surveyId);
    this.getOrganizations(surveyId);
    this.getIndicators(surveyId);
  }

  getApplications(surveyId) {
    const applications = this.props.surveys
      ? this.props.surveys.filter(item => item.id === surveyId)[0].applications
      : [];
    this.setState({
      applications
    });
  }

  getOrganizations(surveyId) {
    const organizations = this.props.surveys
      ? this.props.surveys.filter(item => item.id === surveyId)[0].organizations
      : [];
    this.setState({
      organizations
    });
  }

  selectApplication(applicationId) {
    this.setState({
      selectedApplications: [...this.state.selectedApplications,
        this.state.applications.filter(item => item.id === applicationId)[0]
      ]
    });
  }

  deselectApplication(applicationId) {
    this.setState({
      selectedApplications: this.state.selectedApplications.filter(
        item => item.id !== applicationId
      )
    });
  }

  selectOrganization(organizationId) {
    this.setState({
      selectedOrganizations: [
        ...this.state.selectedOrganizations,
        this.state.organizations.filter(item => item.id === organizationId)[0]
      ]
    });
  }

  deselectOrganization(organizationId) {
    this.setState({
      selectedOrganizations: this.state.selectedOrganizations.filter(
        item => item.id !== organizationId
      )
    });
  }

  selectPeriod(from, to) {
    if (from && to) {
      this.setState({ selectedPeriod: [from, to] });
    } else this.setState({ selectedPeriod: [] });
  }

  toggleMultipleSnapshots() {
    this.setState({ multipleSnapshots: !this.state.multipleSnapshots });
  }

  getIndicators(surveyId) {
    const indicators = this.props.surveys
      ? this.props.surveys.filter(item => item.id === surveyId)[0]
          .survey_ui_schema['ui:group:indicators']
      : [];
    this.setState({
      indicators
    });
  }

  selectIndicator(indicator) {
    const selectedIndicators = this.state.selectedIndicators;
    selectedIndicators[indicator] = ['RED', 'YELLOW', 'GREEN'];
    this.setState({
      selectedIndicators
    });
  }

  deselectIndicator(indicator) {
    const selectedIndicators = this.state.selectedIndicators;
    delete selectedIndicators[indicator];
    this.setState({
      selectedIndicators
    });
  }

  toggleSelectedColors({ color, indicator }) {
    if (this.state.selectedIndicators[indicator].includes(color)) {
      let selectedIndicators = this.state.selectedIndicators;
      selectedIndicators[indicator] = selectedIndicators[indicator].filter(
        item => item !== color
      );
      this.setState({
        selectedIndicators
      });
    } else {
      let selectedIndicators = this.state.selectedIndicators;
      selectedIndicators[indicator].push(color);
      this.setState({
        selectedIndicators
      });
    }
  }

  showReportPreview() {
    let filters = this.getFilters();
    fetch(`${env.API}/reports/snapshots/json`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.props.token}`,
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(filters)
    })
    .then(response => response.json())
    .then(json => {
      console.log('json', json);
    });
  }

  downloadCVSReport() {
    let filters = this.getFilters();
    fetch(`${env.API}/reports/snapshots/csv`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.props.token}`,
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(filters)
    })
    .then(response => response.blob())
    .then(blob => {
      const a = window.document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = "snapshots.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }

  getFilters() {
    return {
      "survey_id": this.state.selectedSurveyId,
      "applications": this.state.selectedApplications.map(item => item.id),
      "organizations": this.state.selectedOrganizations.map(item => item.id),
      "fromDate": this.state.selectedPeriod[0],
      "toDate": this.state.selectedPeriod[1],
      "multipleSnapshots": this.state.multipleSnapshots,
      "matchQuantifier": "ALL",
      "indicatorsFilters": this.state.selectedIndicators
    };
  }

  render() {
    return (
      <div>

        <label>Survey</label>
        <select
          className="map-select"
          onChange={e => this.selectSurvey(Number(e.target.value))}
        >
          {this.getSurveys(this.props.surveys).map(item => (
            <option value={item.id}>{item.title}</option>
          ))}
        </select>
        <hr />

        <label>Hubs</label>
        <SelectWithTags
          items={this.state.applications.filter(
            item => !this.state.selectedApplications.includes(item)
          )}
          selectedItems={this.state.selectedApplications}
          selectMethod={this.selectApplication}
          deselectMethod={this.deselectApplication}
        />
        <hr />

        <label>Organization</label>
        <SelectWithTags
          items={this.state.organizations.filter(
            item => !this.state.selectedOrganizations.includes(item)
          )}
          selectedItems={this.state.selectedOrganizations}
          selectMethod={this.selectOrganization}
          deselectMethod={this.deselectOrganization}
        />
        <hr />

        <label>Time Period</label>
        <TimePeriod
          selectPeriod={this.selectPeriod}
          toggleMultipleSnapshots={this.toggleMultipleSnapshots}
        />
        <hr />

        <label>Indicators</label>
        <Indicators
          indicators={this.state.indicators}
          selectedIndicators={this.state.selectedIndicators}
          selectIndicator={this.selectIndicator}
          deselectIndicator={this.deselectIndicator}
          toggleSelectedColors={this.toggleSelectedColors}
        />
        <hr />

        <button
          className="btn btn-primary"
          onClick={this.showReportPreview()}
        >
          Show Report Preview
        </button>
        <hr />

        <button
          className="btn btn-primary"
          onClick={this.downloadCVSReport()}
        >
          Download Report
        </button>

      </div>
    );
  }
}
