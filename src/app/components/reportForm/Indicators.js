import React from 'react';
import { camelCasetoWords } from '../utils.js';
import ColorPicker from '../map/colorPicker';

export default props => (
  <div>
    {props.indicators.map(item => (
      <div key={item} className="row">
        <div className="col-xs-6">
          <input
            type="checkbox"
            id={item}
            name={item}
            value={item}
            onChange={() =>
              Object.keys(props.selectedIndicators).includes(item)
                ? props.deselectIndicator(item)
                : props.selectIndicator(item)
            }
          />
          <label>{camelCasetoWords(item)}</label>
        </div>
        <div className="col-xs-6">
          {Object.keys(props.selectedIndicators).includes(item) && (
            <ColorPicker
              toggleSelectedColors={props.toggleSelectedColors}
              indicator={item}
              selectedColors={props.selectedIndicators[item]}
            />
          )}
        </div>
      </div>
    ))}
  </div>
);
