requirejs.config({
  baseUrl: "js",
  paths: {
    app: "/assets/js/app",
    backbone: "/vendor/bower_installed/backbone/backbone",
    bootstrap: "/vendor/bower_installed/bootstrap/dist/js/bootstrap",
    jquery: "/vendor/bower_installed/jquery/dist/jquery",
    "jquery-ui": "/vendor/bower_installed/jquery-ui/jquery-ui",
    marionette: "/vendor/bower_installed/backbone.marionette/lib/backbone.marionette",
    text: "/vendor/bower_installed/requirejs-text/text",
    tpl: "/vendor/bower_installed/requirejs-underscore-tpl/underscore-tpl",
    underscore: "/vendor/bower_installed/underscore/underscore",
    json2: "/vendor/bower_installed/json2/json2"
  },
  shim: {
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
    "jquery-ui": ["jquery"],
    tpl: ["text"]
  }
});

require(["app"], function(Moonlander){
  Moonlander.start();
});