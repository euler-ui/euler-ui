import React from 'react'
import ReactDOM from 'react-dom'
import './spinner.css'
import CircleSpinner from 'spin.js'
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

const CircleLoader = React.createClass({
  componentDidMount() {
    var opts = {
      lines: 13, // The number of lines to draw
      length: 12, // The length of each line
      width: 10, // The line thickness
      radius: 20, // The radius of the inner circle
      scale: 1, // Scales overall size of the spinner
      corners: 1, // Corner roundness (0..1)
      color: '#000', // #rgb or #rrggbb or array of colors
      opacity: 0.25, // Opacity of the lines
      rotate: 0, // The rotation offset
      direction: 1, // 1: clockwise, -1: counterclockwise
      speed: 1, // Rounds per second
      trail: 60, // Afterglow percentage
      fps: 20, // Frames per second when using setTimeout() as a fallback for CSS
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      top: '40%', // Top position relative to parent
      left: '50%', // Left position relative to parent
      shadow: false, // Whether to render a shadow
      hwaccel: false, // Whether to use hardware acceleration
      position: 'absolute' // Element positioning
    }
    var target = ReactDOM.findDOMNode(this.refs.spin);
    new CircleSpinner(opts).spin(target);
  },
  render() {
    return (<div ref="spin" className="circleloader">
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
    var loader = (<CircleLoader />);
    if (type === 'ring') {
      loader = <RingLoader />;
    } else if (type === 'dot') {
      loader = <DotLoader />;
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