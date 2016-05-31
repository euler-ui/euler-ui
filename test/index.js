var componentsContext = require.context('../src', true, /.*\.js$/);
componentsContext.keys().forEach(componentsContext);

componentsContext = require.context('.', true, /Test\.js$/);
componentsContext.keys().forEach(componentsContext);