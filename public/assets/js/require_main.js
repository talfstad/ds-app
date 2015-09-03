requirejs.config({
  baseUrl: "js",
  paths: {
    app: "/assets/js/app",
    backbone: "/vendor/bower_installed/backbone/backbone",
    syphon: "/vendor/bower_installed/backbone.syphon/lib/backbone.syphon",
    "backbone.validation": "/vendor/bower_installed/backbone.validation/dist/backbone-validation-amd",
    bootstrap: "/vendor/bower_installed/bootstrap/dist/js/bootstrap",
    jquery: "/vendor/bower_installed/jquery/dist/jquery",
    "jquery.ui": "/vendor/bower_installed/jquery-ui/jquery-ui",
    marionette: "/vendor/bower_installed/backbone.marionette/lib/backbone.marionette",
    text: "/vendor/bower_installed/requirejs-text/text",
    tpl: "/vendor/bower_installed/requirejs-underscore-tpl/underscore-tpl",
    underscore: "/vendor/bower_installed/underscore/underscore",
    json2: "/vendor/bower_installed/json2/json2",
    canvasbg: "/vendor/plugins/canvasbg/canvasbg", // CanvasBG Plugin(creates mousehover effect)
    "theme.utility": "/assets/js/utility/utility",
    "theme.demo": "/assets/js/demo/demo",
    "theme.main": "/assets/js/main",
    pnotify: '/vendor/plugins/pnotify/pnotify',
    "pnotify.buttons": '/vendor/plugins/pnotify/pnotify'
  },
  shim: {
    "theme.utility": {
      deps: ['jquery', 'jquery.ui']
    },
    "theme.demo": {
      deps: ['jquery', 'jquery.ui']
    },
    "theme.main": {
      deps: ['jquery', 'jquery.ui']
    },
    canvasbg: {
      deps: ['jquery']
    },
    bootstrap: {
      deps: ['jquery']
    },
    underscore: {
      exports: "_"
    },
    backbone: {
      deps: ["jquery", "underscore", "json2"],
      exports: "Backbone"
    },
    marionette: {
      deps: ["backbone"],
      exports: "Marionette"
    },
    "jquery.ui": ["jquery"],
    tpl: ["text", "underscore"]
  }
});

require(["app"], function(Moonlander){
  Moonlander.start();
});