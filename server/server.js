//GLOBALS
_ = require('underscore');

//module dependencies
var express = require("express");
var http = require("http");
var path = require("path");
var hbs = require("hbs");
var logger = require('morgan');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
//var session = require('express-session');
var bodyParser = require('body-parser');
//used for new lander upload
var multer = require('multer');
var methodOverride = require('method-override');
var config = require("./config");
var mysql = require("mysql");

//config
var env = 'prod';
if (process.argv[2] == 'dev') {
  env = process.argv[2];
}

var app = express();

app.config = config[env];

var logger = require("./utils/debug_log")(app);
app.log = logger;


var db = mysql.createPool(app.config.dbConnectionInfo);

var dbApi = require("./db_api")(app, db);

//gzip
var compress = require('compression');
app.use(compress());

var login = require("./passport_login");
login.initialize(app, dbApi);

app.use(bodyParser.json({
  limit: '20mb'
}));

app.use(cookieParser(app.config.cookieSecret)); // populates req.signedCookies
//app.use(session({ secret: config.sessionSecret, resave: true, saveUninitialized: true }));

app.use(bodyParser.urlencoded({
  limit: '20mb',
  extended: true
})); // parse application/x-www-form-urlencoded
app.use(methodOverride()); // must come after bodyParser

app.use(multer({ dest: './staging' }).any());

app.set('view engine', 'html');
app.set('views', __dirname + '/');
app.engine('html', hbs.__express);

app.use(express.static(__dirname + '/../public'));

require("./routes")(app, login, dbApi);

http.globalAgent.maxSockets = 100

//server
http.createServer(app).listen(app.config.port, function() {
  console.log('Express server listening on port ' + app.config.port);
});

if (env != "dev") {
  process.on("uncaughtException", function(err) {

    console.log("FATAL ERROR: \n" + JSON.stringify(err));

    dbApi.log.fatal.error(err, function(err) {
      if (err) {
        console.log("error logging fatal: " + JSON.stringify(err));
      }
    });

  });
} else if (env == "dev") {
  app.log("ATTENTION: running in dev mode", "debug");
}


module.exports = app;
