var componentsContext = require.context('../src', true, /.*\.js$/);
componentsContext.keys().forEach((key) => {
  if ("./request/server.js" === key) {
    return;
  }
  componentsContext(key);
});

var componentsContext = require.context('.', true, /Test\.js$/);
componentsContext.keys().forEach(componentsContext);