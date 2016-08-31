import React from 'react'
import ReactDOM from 'react-dom'
import './spinner.css'
const RingLoader = React.createClass({
  render() {
    return (<div className="spinner__ring">
              <div className="spinner__ring1"></div>
              <div className="spinner__ring2"></div>
            </div>)
  }
})
const DotLoader = React.createClass({
  render() {
    return (<div className="dotloader">
            </div>)
  }
})
const Spinner = React.createClass({
  getDefaultProps() {
    return {
      color: "#26A65B",
      size: "48px"
    };
  },
  hide() {
    ReactDOM.findDOMNode(this.refs.spinner).style.display = "none";
  },
  show() {
    ReactDOM.findDOMNode(this.refs.spinner).style.display = "block";
  },
  render() {
    var props = this.props;
    var type = props.type;
    var loader = (<DotLoader />);
    if (type === 'ring') {
      loader = <RingLoader />
    }
    return (
      <div ref="spinner" className="spinner">
        <div className="spinner__mask"></div>
        { loader }
      </div>
      );
  }
})
let lastSpinner;
const SpinnerCreator = {
  show(options = {}) {
    var target = options.at || document.body;
    lastSpinner = target.spinner;
    if (lastSpinner) {
      lastSpinner.show();
      return lastSpinner;
    }
    var spinnerContianer = document.createElement('div');
    target.appendChild(spinnerContianer);
    lastSpinner = ReactDOM.render(<Spinner {...options} />, spinnerContianer);
    target.spinner = lastSpinner;
    return lastSpinner;
  },
  hide(spinner) {
    var spinnerToHide = spinner || lastSpinner;
    spinnerToHide.hide();
  }
}

export default SpinnerCreator