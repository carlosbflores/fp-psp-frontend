/* eslint {"no-prototype-builtins": 0, "react/no-unused-state": 0} */

import React from 'react';
import SelectWithTags from './selectWithTags';
import Indicators from './indicators';
import TimePeriod from './timePeriod';
import SocialIndicators from './socialIndicators';

export default class FormContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSurvey: '',
      indicators: [],
      displayedSocialIndicators: {},
      selectedIndicators: {},
      organizations: [],
      selectedOrganizations: [],
      selectedPeriod: [],
      multipleSnapshots: false
    };

    this.selectSurvey = this.selectSurvey.bind(this);
    this.selectOrganization = this.selectOrganization.bind(this);
    this.deselectOrganization = this.deselectOrganization.bind(this);
    this.selectIndicator = this.selectIndicator.bind(this);
    this.deselectIndicator = this.deselectIndicator.bind(this);
    this.toggleSelectedColors = this.toggleSelectedColors.bind(this);
    this.selectPeriod = this.selectPeriod.bind(this);
    this.toggleMultipleSnapshots = this.toggleMultipleSnapshots.bind(this);
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
      this.getSocialIndicators(this.props.surveyData[0].title);
      this.getOrganizations(this.props.surveyData[0].title);
    }
  }

  selectSurvey(survey) {
    this.setState({
      selectedSurvey: survey
    });
    this.getIndicators(survey);
    this.getSocialIndicators(survey);
    this.getOrganizations(survey);
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

  getSocialIndicators(survey) {
    const socialIndicatorsTargetKeys = this.props.surveyData
      ? this.props.surveyData.filter(item => item.title === survey)[0]
          .survey_ui_schema['ui:group:economics']
      : [];
    const socialIndicators = this.props.surveyData
      ? this.props.surveyData.filter(item => item.title === survey)[0]
          .survey_schema.properties
      : {};
    const displayedSocialIndicators = {};
    const socialIndicatorsInitalKeys = Object.keys(socialIndicators);
    socialIndicatorsInitalKeys.forEach(key => {
      if (
        socialIndicatorsTargetKeys.includes(key) &&
        (socialIndicators[key].hasOwnProperty('enum') ||
          socialIndicators[key].type === 'number')
      ) {
        displayedSocialIndicators[key] = socialIndicators[key];
      }
    });
    this.setState({
      displayedSocialIndicators
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

  getOrganizations(survey) {
    const organizations = this.props.surveyData
      ? this.props.surveyData.filter(item => item.title === survey)[0]
          .organizations
      : [];
    this.setState({
      organizations
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
    const {
      organizations,
      selectedOrganizations,
      displayedSocialIndicators,
      indicators,
      selectedIndicators
    } = this.state;
    return (
      <div>
        <label>Organization</label>
        <SelectWithTags
          items={organizations.filter(
            item => !selectedOrganizations.includes(item)
          )}
          selectedItems={selectedOrganizations}
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
        <label>Displayed Social Indicators</label>
        <SocialIndicators
          displayedSocialIndicators={displayedSocialIndicators}
        />
        <label>Indicators</label>
        <Indicators
          indicators={indicators}
          selectedIndicators={selectedIndicators}
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
