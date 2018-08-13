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
    return (
      <div>
        <div className="report-taglist" onClick={this.toggleDropdown}>
          {this.props.selectedItems.map(item => (
            <div className="report-tag" key={item.id}>
              {item.name}
              <span
                onClick={e => {
                  this.props.deselectMethod(item.name);
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
            {this.props.items.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  this.props.selectMethod(item.name);
                  this.toggleDropdown();
                }}
              >
                {item.name}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}
