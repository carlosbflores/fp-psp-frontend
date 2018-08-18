import React from 'react';
import { camelCasetoWords } from '../utils.js';

export default props => (
  <div>
    {Object.keys(props.displayedSocialIndicators).map(item => (
      <div key={item} className="row">
        <div className="col-xs-6">
          <input type="checkbox" id={item} name={item} value={item} />
          <label>{camelCasetoWords(item)}</label>
        </div>
      </div>
    ))}
  </div>
);
