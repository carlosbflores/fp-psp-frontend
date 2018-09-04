/* eslint {"no-prototype-builtins": 0, "react/no-unused-state": 0} */

import React from 'react';
import SelectWithTags from './selectWithTags';
import Indicators from './Indicators';
import Economics from './Economics';
import TimePeriod from './timePeriod';
import env from '../../env';

export default class FormContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSurvey: null,
      indicators: [],
      economics: [],
      selectedIndicators: {},
      selectedEconomics: {},
      organizations: [],
      applications: [],
      selectedOrganizations: [],
      selectedApplications: [],
      selectedPeriod: [],
      multipleSnapshots: false,
      reportPreview: [],
      match: 'ALL'
    };

    this.selectSurvey = this.selectSurvey.bind(this);
    this.selectOrganization = this.selectOrganization.bind(this);
    this.deselectOrganization = this.deselectOrganization.bind(this);
    this.selectApplication = this.selectApplication.bind(this);
    this.deselectApplication = this.deselectApplication.bind(this);
    this.selectIndicator = this.selectIndicator.bind(this);
    this.deselectIndicator = this.deselectIndicator.bind(this);
    this.selectEconomic = this.selectEconomic.bind(this);
    this.deselectEconomic = this.deselectEconomic.bind(this);
    this.changeNumberEconomic = this.changeNumberEconomic.bind(this);
    this.selectFilter = this.selectFilter.bind(this);
    this.deselectFilter = this.deselectFilter.bind(this);
    this.toggleSelectedColors = this.toggleSelectedColors.bind(this);
    this.selectPeriod = this.selectPeriod.bind(this);
    this.toggleMultipleSnapshots = this.toggleMultipleSnapshots.bind(this);
    this.getFilteredEconomics = this.getFilteredEconomics.bind(this);
    this.showPreview = this.showPreview.bind(this);
    this.downloadCSVReport = this.downloadCSVReport.bind(this);
    this.changeMatch = this.changeMatch.bind(this);
  }

  componentDidMount() {
    if (this.props.surveyData && this.state.selectedSurvey === null) {
      this.selectSurvey(this.props.surveyData[0].title);
    }
  }

  getSurveys(data) {
    return data.map(item => item.title);
  }

  selectSurvey(survey) {
    this.setState({
      selectedSurvey: this.props.surveyData.filter(
        item => item.title === survey
      )[0],
      selectedIndicators: {},
      selectedEconomics: {}
    });
    this.getIndicators(survey);
    this.getOrganizationsAndApps(survey);
    this.getFilteredEconomics(survey);
  }

  getIndicators(survey) {
    const data =
      this.props.surveyData &&
      this.props.surveyData.filter(item => item.title === survey)[0];

    this.setState({
      indicators: data ? data.survey_ui_schema['ui:group:indicators'] : []
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

  selectEconomic(economic) {
    const selectedEconomics = this.state.selectedEconomics;
    selectedEconomics[economic.name] = economic;
    this.setState({
      selectedEconomics
    });
  }

  deselectEconomic(economic) {
    const selectedEconomics = this.state.selectedEconomics;
    delete selectedEconomics[economic.name];
    this.setState({
      selectedEconomics
    });
  }

  changeNumberEconomic(economicName, type, value) {
    const selectedEconomics = this.state.selectedEconomics;
    selectedEconomics[economicName][type] = value;
    this.setState({
      selectedEconomics
    });
  }

  selectFilter(economicName, filter) {
    const selectedEconomics = this.state.selectedEconomics;
    selectedEconomics[economicName].selectedFilters.push(filter);
    this.setState({
      selectedEconomics
    });
  }

  deselectFilter(economicName, filter) {
    const selectedEconomics = this.state.selectedEconomics;

    selectedEconomics[economicName].selectedFilters = selectedEconomics[
      economicName
    ].selectedFilters.filter(item => item !== filter);

    this.setState({
      selectedEconomics
    });
  }

  getFilteredEconomics(survey) {
    const data =
      this.props.surveyData &&
      this.props.surveyData.filter(item => item.title === survey)[0];

    if (data) {
      const tmp = [];
      data.survey_ui_schema['ui:group:economics'].forEach(item => {
        const factor =
          data.survey_ui_schema['ui:custom:fields'][item] ||
          data.survey_schema.properties[item];

        if (factor && factor['ui:field'] === 'numberFormat') {
          tmp.push({ name: item });
        }

        if (factor && factor.enum) {
          tmp.push({ name: item, enum: factor.enum, selectedFilters: [] });
        }
      });

      this.setState({
        economics: tmp
      });
    }
  }

  getOrganizationsAndApps(survey) {
    const data =
      this.props.surveyData &&
      this.props.surveyData.filter(item => item.title === survey)[0];

    this.setState({
      organizations: data ? data.organizations : [],
      applications: data && data.applications ? data.applications : []
    });
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

  selectApplication(application) {
    this.setState({
      selectedApplications: [
        ...this.state.selectedApplications,
        this.state.applications.filter(item => item.name === application)[0]
      ]
    });
  }

  deselectApplication(application) {
    this.setState({
      selectedApplications: this.state.selectedApplications.filter(
        item => item.name !== application
      )
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

  selectPeriod(from, to) {
    if (from && to) {
      this.setState({ selectedPeriod: [from, to] });
    } else this.setState({ selectedPeriod: [] });
  }

  toggleMultipleSnapshots() {
    this.setState({ multipleSnapshots: !this.state.multipleSnapshots });
  }

  showPreview() {
    let filters = this.getFilters();
    fetch(`${env.API}/reports/snapshots/json`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(filters)
    })
      .then(response => response.json())
      .then(json => {
        this.setState({
          reportPreview: json
        });
      });
  }

  downloadCSVReport() {
    let filters = this.getFilters();
    fetch(`${env.API}/reports/snapshots/csv`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.props.token}`,
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(filters)
    })
      .then(response => response.blob())
      .then(blob => {
        const a = window.document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = 'snapshots.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
  }

  getFilters() {
    const {
      selectedApplications,
      selectedOrganizations,
      selectedSurvey,
      selectedPeriod,
      multipleSnapshots,
      selectedIndicators,
      selectedEconomics,
      match
    } = this.state;

    const socioeconomicFilters = {};

    Object.values(selectedEconomics).forEach(item => {
      if (item.min && item.max) {
        socioeconomicFilters[item.name] = [item.min, item.max];
      }

      if (item.enum) {
        socioeconomicFilters[item.name] = item.selectedFilters;
      }
    });

    const send = {
      applications: selectedApplications.map(applications => applications.id),
      organizations: selectedOrganizations.map(organization => organization.id),
      survey_id: selectedSurvey.id,
      fromDate: selectedPeriod[0],
      toDate: selectedPeriod[1],
      multipleSnapshots,
      matchQuantifier: match,
      indicatorsFilters: selectedIndicators,
      socioeconomicFilters
    };

    return send;
  }

  changeMatch(e) {
    this.setState({ match: e.target.value });
  }

  render() {
    const {
      organizations,
      selectedOrganizations,
      applications,
      selectedApplications,
      indicators,
      selectedIndicators,
      economics,
      selectedEconomics,
      match,
      reportPreview
    } = this.state;

    return (
      <div className="report-form">
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

        {this.props.user === 'ROLE_ROOT' && (
          <div>
            <label>Hubs</label>
            <SelectWithTags
              items={applications.filter(
                item => !selectedApplications.includes(item)
              )}
              selectedItems={selectedApplications}
              selectMethod={this.selectApplication}
              deselectMethod={this.deselectApplication}
            />
            <hr />
          </div>
        )}

        {(this.props.user === 'ROLE_ROOT' ||
          this.props.user === 'ROLE_HUB_ADMIN') && (
          <div>
            <label>Organizations</label>
            <SelectWithTags
              items={organizations
                .filter(
                  item =>
                    selectedApplications.length
                      ? selectedApplications
                          .map(app => app.name)
                          .includes(item.application.name)
                      : item
                )
                .filter(item => !selectedOrganizations.includes(item))}
              selectedItems={selectedOrganizations}
              selectMethod={this.selectOrganization}
              deselectMethod={this.deselectOrganization}
            />
            <hr />
          </div>
        )}

        <label>Time Period</label>
        <TimePeriod
          selectPeriod={this.selectPeriod}
          toggleMultipleSnapshots={this.toggleMultipleSnapshots}
        />
        <hr />

        <label>Socioeconomic status</label>
        <Economics
          economics={economics}
          selectedEconomics={selectedEconomics}
          selectEconomic={this.selectEconomic}
          deselectEconomic={this.deselectEconomic}
          changeNumberEconomic={this.changeNumberEconomic}
          selectFilter={this.selectFilter}
          deselectFilter={this.deselectFilter}
        />
        <hr />

        <div>
          <label>Match Filters</label>
          <select value={match} onChange={this.changeMatch}>
            <option value="ALL">All</option>
            <option value="ANY">Any</option>
          </select>
        </div>
        <hr />
        <label>Indicators</label>
        <Indicators
          indicators={indicators}
          selectedIndicators={selectedIndicators}
          selectIndicator={this.selectIndicator}
          deselectIndicator={this.deselectIndicator}
          toggleSelectedColors={this.toggleSelectedColors}
        />
        <hr />

        <button className="btn btn-primary" onClick={this.showPreview}>
          Show Preview
        </button>
        <div>
          {!!reportPreview.length && (
            <ul>
              {reportPreview.map(household => (
                <li key={household.snapshot_economic_id}>
                  <a href={`/#families/${household.snapshot_economic_id}`}>
                    {household.personal_survey_data.firstName}{' '}
                    {household.personal_survey_data.lastName}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button className="btn btn-primary" onClick={this.downloadCSVReport}>
          Download Report
        </button>
      </div>
    );
  }
}
