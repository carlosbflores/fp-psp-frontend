/* eslint react/no-unused-state: 0 */

import React from 'react';
import SelectWithTags from './selectWithTags';
import Indicators from './Indicators';
import Economics from './Economics';
import TimePeriod from './timePeriod';

export default class FormContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSurvey: '',
      indicators: [],
      economics: [],
      selectedIndicators: {},
      selectedEconomics: {},
      organizations: [],
      applications: [],
      selectedOrganizations: [],
      selectedApplications: [],
      selectedPeriod: [],
      multipleSnapshots: false
    };

    this.selectSurvey = this.selectSurvey.bind(this);
    this.selectOrganization = this.selectOrganization.bind(this);
    this.deselectOrganization = this.deselectOrganization.bind(this);
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
      this.getOrganizationsAndApps(this.props.surveyData[0].title);
      this.getFilteredEconomics(this.props.surveyData[0].title);
    }
  }

  selectSurvey(survey) {
    this.setState({
      selectedSurvey: survey,
      selectedIndicators: {},
      selectedEconomics: {}
    });
    this.getIndicators(survey);
    this.getOrganizationsAndApps(survey);
    this.getFilteredEconomics(survey);
  }

  getIndicators(survey) {
    const data = this.props.surveyData
      && this.props.surveyData.filter(item => item.title === survey)[0]

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


    selectedEconomics[economicName].selectedFilters = selectedEconomics[economicName].selectedFilters.filter(
      item => item !== filter
    )

    this.setState({
      selectedEconomics
    });
  }

  getFilteredEconomics(survey) {

    const data = this.props.surveyData
      && this.props.surveyData.filter(item => item.title === survey)[0]


      if (data) {
        const tmp = []
        data.survey_ui_schema['ui:group:economics'].forEach(item => {
          const factor = data.survey_ui_schema['ui:custom:fields'][item] || data.survey_schema.properties[item]

          if (factor && factor["ui:field"] === 'numberFormat' ) {
            tmp.push({name: item})
          }

          if (factor && factor.enum ) {
            tmp.push({name: item, enum: factor.enum, selectedFilters: []})
          }
        })

        this.setState({
          economics: tmp
        });
      }
  }

  getOrganizationsAndApps(survey) {
    const data = this.props.surveyData
      && this.props.surveyData.filter(item => item.title === survey)[0]

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
        <label>Time Period</label>
        <TimePeriod
          selectPeriod={this.selectPeriod}
          toggleMultipleSnapshots={this.toggleMultipleSnapshots}
        />
        <hr />
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
        <label>Socioeconomic status</label>
        <Economics
          economics={this.state.economics}
          selectedEconomics={this.state.selectedEconomics}
          selectEconomic={this.selectEconomic}
          deselectEconomic={this.deselectEconomic}
          changeNumberEconomic={this.changeNumberEconomic}
          selectFilter={this.selectFilter}
          deselectFilter={this.deselectFilter}
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
        <button className="btn btn-primary">Download CVS Report</button>
      </div>
    );
  }
}
