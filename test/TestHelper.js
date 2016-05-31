import { mount } from 'enzyme';
import _ from 'lodash';
import React from 'react';

var req = require.context("../src", true, /\.js$/);

const TestHelper = {
  createComponent(path, options) {
    if (!_.endsWith(path, "/") && !/\.js$/.test(path)) {
      path = path + ".js"
    }
    var DynamicComp = req(path);
    if (DynamicComp.default) {
      DynamicComp = DynamicComp.default
    }
    if (options) {
      DynamicComp.__options = options;;
    }
    return DynamicComp
  },
  renderToDom(Comp) {
    var options = Comp.__options;
    var store = options && options.store;
    var context = options && options.context;
    var childContextTypes = options && options.childContextTypes;

    this.clean();
    var testContent = document.createElement('div');
    testContent.id = "testContent";
    // testContent.width = "100%";
    // testContent.height = "768";
    document.body.appendChild(testContent);

    if (store) {
      Comp = (<Provider store={ store }>
                <Comp />
              </Provider>
      )
    } else {
      Comp = (<Comp />)
    }
    var moutOptions = {
      attachTo: testContent
    }
    if (context) {
      moutOptions.context = context;
      moutOptions.childContextTypes = childContextTypes;
    }

    return mount(
      Comp,
      moutOptions
    );
  },
  createRenderedComponent(path, options) {
    var RenderedComp = this.createComponent(path, options);
    return this.renderToDom(RenderedComp);
  },
  clean() {
    var testContent = document.getElementById("testContent");
    if (testContent) {
      document.body.removeChild(testContent);
    }
  }
}

export default TestHelper