requirejs.config({
  baseUrl: '/',
  paths: {
    'backbone': '3p/js/backbone',
    'backbone.wreqr': '3p/js/backbone.wreqr',
    'backbone.babysitter': '3p/js/backbone.babysitter',
    'backbone.marionette': '3p/js/backbone.marionette',
    'backbone.geppetto': '3p/js/backbone.geppetto',
    'jquery': '3p/js/jquery-1.9.1.min',
    'bootstrap': '3p/bootstrap/js/bootstrap',
    'text': '3p/js/text',
    'underscore': '3p/js/lodash.min',
    'app': 'js/app'
  },
  shim: {
    'underscore': {
      exports: '_'
    },
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'backbone.marionette': {
      deps: ['underscore', 'jquery', 'backbone'],
      exports: 'Backbone'
    },
    'bootstrap': ['jquery']
  }
});

require([
  'backbone.geppetto',
  'app'
], function(Geppetto, app) {
  // expose context map as public property so that
  // we can monitor the number of contexts and events
  Geppetto.setDebug(true);

  app.start({
    
  });
});

// $(function() {
//   $('#test').click(function(e) {
//     $.ajax('http://localhost:3001/User/1/changeName', {
//       data: JSON.stringify({ firstName: 'Jonas', lastName: 'Matser' }),
//       processData: false,
//       type: 'POST',
//       contentType: 'application/json',
//       error: function() { console.log('ERROR:', arguments); },
//       success: function() { console.log('SUCCESS:', arguments); }
//     });
//   });
// });
