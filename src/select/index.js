import React from 'react';
// import request from '../../request/Request'
import _ from 'lodash';
import RSelect from 'react-select';
import './select.css';

/**
<Select ref="priority" 
label="Priority" 
labelClassName="col-xs-2" 
labelKey="text" 
valueKey="id" 
wrapperClassName="col-xs-9" 
url={ requestTypes.GET_PRIORITY_LIST } 
queryParams={{param1: 'value1'}}
restParams={{productId: 1000}}
labelRenderer={this.labelRenderer}
data={ [{ text: "P11", id: "1" }] }/>

props:
@label if label is not defined, label div will be hidden
@labelClassName label class
@labelKey the key of the option dsipaly text
@valueKey the key of the option value
@wrapperClassName select input class
@url request urls to fetch data
@queryParams works with @url as url parameters
@restParams works with @url as rest parameters, 
    if path at conf*.json is '/issues/product/:productId/groupbystatus', 
    the real path will be '/issues/product/1000/groupbystatus'    
@data static json data, it will override @url priority
@clearable able to clear the selected value
@afterChange afterchange callback will be executed after the selection change
@afterInit afterinit callback will be executed after the selection first initialization
@value set select default value
@labelRenderer it is a function to render the label

methods:
this.priority.getValue() will return current value
this.priority.getDisplayValue() will return display value
**/
var Select = React.createClass({
  getDefaultProps() {
    return {
      clearable: true,
      disabled: false
    };
  },
  getInitialState() {
    return {
      value: ""
    };
  },
  loadOptions(input, cb) {
    var url = this.props.url;
    var data = this.props.data || [];
    if (data.length > 0) {
      this.initSelect(data, cb);
      return
    }
    if (url) {
      this.fetchOptions(url, cb);
    }
  },
  fetchOptions(url, cb) {
    var me = this;
    // request({
    //   url: url,
    //   queryParams: me.props.queryParams,
    //   restParams: me.props.restParams
    // }, (err, response) => {
    //   var items = response.body || [];
    //   me.initSelect(items, cb)
    // })
  },
  initSelect(items, cb) {
    var labelRenderer = this.props.labelRenderer;
    var labelKey = this.props.labelKey;
    if (labelRenderer) {
      _.each(items, (item) => {
        item[labelKey] = labelRenderer(item);
      })
    }

    cb(null, {
      options: items,
      complete: true
    });
    var value = this.props.value;
    if (!value && value !== "") {
      value = items[0]
    }
    this.setState({
      value: value
    })
    var afterInit = this.props.afterInit;
    if (afterInit) {
      afterInit();
    }
  },
  onChange(value) {
    this.setState({
      value: value,
    });
    // hot fix for getvalue issue at afterchange
    var afterChange = this.props.afterChange;
    if (afterChange) {
      setTimeout(afterChange, 0);
    }
  },
  getValue() {
    var value = this.state.value;
    if (value && !_.isObject(value)) {
      return value;
    }
    return this.state.value && this.state.value[this.props.valueKey]
  },
  getDisplayValue() {
    return this.state.value && this.state.value[this.props.labelKey]
  },
  render() {
    var props = this.props;
    var labelKey = props.labelKey || "label";
    var valueKey = props.valueKey || "value";
    var hideLabelStyle = '';
    if (!props.label) {
      hideLabelStyle = 'label-invisible'
    }
    return (
      <div className="form-group">
        <label className={ `${props.labelClassName} control-label ${hideLabelStyle}` }>
          { props.label }
        </label>
        <div className={ props.wrapperClassName }>
          <RSelect.Async clearable={ props.clearable } disabled={ props.disabled } searchable={ false } valueKey={ valueKey } value={ this.state.value }
            onChange={ this.onChange } labelKey={ labelKey } afterInit={ props.afterInit } loadOptions={ this.loadOptions } />
        </div>
      </div>
      );
  }
});

export default Select