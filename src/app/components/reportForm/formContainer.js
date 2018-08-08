import React from 'react';
import camelCasetoWords from '../utils.js';

export default class FormContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSurvey: '',
      indicators: []
    };

    this.getIndicators = this.getIndicators.bind(this);
    this.selectSurvey = this.selectSurvey.bind(this);
  }

  componentDidMount() {
    this.selectDefaultSurvey();
  }

  getSurveys(data) {
    return data.map(survey => survey.title);
  }

  selectDefaultSurvey() {
    if (this.props.surveyData && this.state.selectedSurvey === '') {
      this.setState({
        selectedSurvey: this.props.surveyData[0].title
      });
      this.getIndicators(this.props.surveyData[0].title);
    }
  }

  selectSurvey(survey) {
    this.setState({
      selectedSurvey: survey
    });
    this.getIndicators(survey);
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
        <div className="col-sm-7">
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
      </div>
    );
  }
}
