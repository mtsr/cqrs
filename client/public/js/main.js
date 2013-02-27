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
    'runtime': '3p/js/runtime',
    'modernizr': '3p/js/modernizr',
    'facebook': '//connect.facebook.net/en_US/all.js?appId=324071964354776&channelUrl=channel.html&status=1&cookie=1&xfbml=1'
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
    'bootstrap': ['jquery'],
    'runtime': {
      exports: 'jade'
    },
    'facebook': {
      exports: this.FB
    }
  }
});

require([
  'js/console',
  'modernizr',
  'backbone.geppetto',
  'js/fix',
  'js/App',
], function(console, modernizr, Geppetto, fix, App) {
  // expose context map as public property so that
  // we can monitor the number of contexts and events
  Geppetto.setDebug(true);

  App.start({
    
  });
});

// $(function() {
//   $('#test').click(function(e) {
//     $.ajax('http://localhost:3001/User/1/changeName', {
//       data: JSON.stringify({ firstName: 'Jonas', lastName: 'Matser' }),
//       processData: false,
//       type: 'POST',
//       contentType: 'Application/json',
//       error: function() { console.log('ERROR:', arguments); },
//       success: function() { console.log('SUCCESS:', arguments); }
//     });
//   });
// });
