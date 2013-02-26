requirejs.config({
  baseUrl: '/',
  paths: {
    'backbone': '3p/js/backbone',
    'backbone.marionette': '3p/js/backbone.marionette',
    'jquery': '3p/js/jquery-1.9.1.min',
    'bootstrap': '3p/bootstrap/js/bootstrap',
    'text': '3p/js/text',
    'lodash': '3p/js/underscore-min'
  },
  shim: {
    'backbone': {
      deps: ['lodash', 'jquery'],
      exports: 'Backbone'
    },
    'backbone.marionette': {
      deps: ['lodash', 'jquery', 'backbone'],
      exports: 'Backbone'
    },
    'bootstrap': ['jquery'],
  }
});

require(['jquery'], function($) {
  $(function() {
    $('#test').click(function(e) {
      $.ajax('http://localhost:3001/User/1/changeName', {
        data: JSON.stringify({ firstName: 'Jonas', lastName: 'Matser' }),
        processData: false,
        type: 'POST',
        contentType: 'application/json',
        error: function() { console.log('ERROR:', arguments); },
        success: function() { console.log('SUCCESS:', arguments); }
      });
    });
  });
});
