import React from 'react';
import SelectWithTags from './selectWithTags';
import { camelCasetoWords } from '../utils.js';

export default props => (
  <div>
    {props.economics.map(item => (
      <div key={item.name} className="row">
        <div className="col-xs-6">
          <label>
            <input
              type="checkbox"
              id={item}
              name={item}
              value={item}
              onChange={() =>
                Object.keys(props.selectedEconomics).includes(item.name)
                  ? props.deselectEconomic(item)
                  : props.selectEconomic(item)
              }
            />
            {camelCasetoWords(item.name)}
          </label>
        </div>
        <div className="col-xs-6">
          {Object.keys(props.selectedEconomics).includes(item.name) && (
            <div>
              {item.enum ? (
                <div>
                  <SelectWithTags
                    name={item.name}
                    items={item.enum}
                    selectedItems={item.selectedFilters}
                    selectMethod={props.selectFilter}
                    deselectMethod={props.deselectFilter}
                  />
                </div>
              ) : (
                <div>
                  From <input type="number" onChange={(e) => props.changeNumberEconomic(item.name, 'min', e.target.value)} value={item.min || 0} />
                  To <input type="number" onChange={(e) => props.changeNumberEconomic(item.name, 'max', e.target.value)} value={item.max || 0} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
);
