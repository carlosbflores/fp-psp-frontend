import React from 'react';
import Datetime from 'react-datetime';
import session from '../../common/session';

require('moment/locale/es');

// component properties reference
let componentProps;
// component reference
let componentRef;

class DatetimeFormat extends React.Component {
  constructor(props) {
    super(props);
    this.setInitialValues(props);
    componentRef = this;
    componentProps = props;
  }

  setInitialValues(props) {
    let value = '';
    if (props.schema && props.schema.default) {
      value = props.schema.default;
    } else if (props.formData === undefined || props.formData.length === 0) {
      value = '';
      setImmediate(() => props.onChange(''));
    } else {
      value = props.formData;
    }
    this.state = {
      name: props.name,
      title: props.schema.title,
      required: props.required ? '*' : '',
      valueView: value
    };
  }

  _handleOnChange(calendarEvent) {
    let date = '';
    if (typeof calendarEvent === 'object') {
      date = calendarEvent.format('YYYY-MM-DD');
    }
    componentRef.setState({
      valueView: date
    });

    setImmediate(() => componentRef.props.onChange(date));
  }

  render() {
    if (this.props.name !== this.state.name) {
      this.setInitialValues(this.props);
    }
    let value=this.state.valueView
    return (
      <Datetime
        dateFormat="MM/DD/YYYY"
        inputProps={{ disabled: true }}
        timeFormat={false}
        defaultValue={value}
        locale={session.get('locale')?session.get('locale'):'es'}
        disableOnClickOutside
        renderInput={this.renderInput}
        onChange={this._handleOnChange}
      />
    );
  }

  renderInput(props, openCalendar) {
    return (
      <div className="rdt form-group field field-number">
        <label className="control-label">
          {componentProps.schema.title}
          {componentProps.required ? '*' : ''}
        </label>
        <br />
        <div className="rdt">
          <input
            {...props}
            id={componentProps.idSchema.$id}
            required={componentProps.required}
            className="form-control"
            type="text"
          />
          <span
            id="calendar-buttom"
            className="glyphicon-calendar"
            onClick={openCalendar}
          />
        </div>
      </div>
    );
  }
}

export default DatetimeFormat;
