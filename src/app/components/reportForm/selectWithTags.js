import React from 'react';
import close from '../../../static/images/close.png';

export default class SelectWithTags extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isDropdownOpen: false };
    this.toggleDropdown = this.toggleDropdown.bind(this);
  }
  toggleDropdown() {
    this.setState({ isDropdownOpen: !this.state.isDropdownOpen });
  }
  render() {
    const { name, items, selectedItems, selectMethod, deselectMethod } = this.props
    return (
      <div>
        <div className="report-taglist" onClick={this.toggleDropdown}>
          {selectedItems.map(item => (
            <div className="report-tag" key={item.id || item}>
              {item.name || item}
              <span
                onClick={e => {
                  if (name) {
                    deselectMethod(name, item)
                  } else {
                    deselectMethod(item.name)
                  }

                  e.stopPropagation();
                }}
                className="report-tag-deselect"
              >
                <img src={close} alt="close-icon" />
              </span>
            </div>
          ))}
        </div>
        {this.state.isDropdownOpen && (
          <div className="report-dropdown">
            {items.map(item => (
              <div
                key={item.id || item}
                onClick={() => {
                  if (name) {
                    selectMethod(name, item)
                  } else {
                    selectMethod(item.name)
                  }
                  this.toggleDropdown();
                }}
              >
                {item.name || item}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}
