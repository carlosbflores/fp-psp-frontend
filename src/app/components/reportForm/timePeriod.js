import React from 'react';
import moment from 'moment';

export default props => (
  <div>
    <input
      type="radio"
      value="all"
      name="period"
      defaultChecked
      onChange={() => props.selectPeriod()}
    />
    <label>All</label>
    <br />
    <input
      type="radio"
      value="one-month"
      name="period"
      onChange={() =>
        props.selectPeriod(
          Number(
            moment()
              .subtract(1, 'months')
              .format('x')
          ),
          Date.now()
        )
      }
    />
    <label>Last month</label>
    <br />
    <input
      type="radio"
      value="six-months"
      name="period"
      onChange={() =>
        props.selectPeriod(
          Number(
            moment()
              .subtract(6, 'months')
              .format('x')
          ),
          Date.now()
        )
      }
    />
    <label>Last six months</label>
    <br />
    <input type="radio" value="custom" name="period" />
    <br />
    <input
      type="checkbox"
      value="multipleSnapshots"
      name="multipleSnapshots"
      onChange={props.toggleMultipleSnapshots}
    />
    <label>Include multiple snapshots per family</label>
  </div>
);
