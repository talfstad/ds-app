//module dependencies
var express = require("express");
var http = require("http");
var path = require("path");
var app = express();
var hbs = require("hbs");
var logger = require('morgan');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
//var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var methodOverride = require('method-override');
var config = require("./config");
var db = require("./db_api");

var login = require("./passport_login");
login.initialize(app, db);

app.use(bodyParser.json({
  limit: '20mb'
}));

app.use( cookieParser( config.cookieSecret ) ); // populates req.signedCookies
//app.use(session({ secret: config.sessionSecret, resave: true, saveUninitialized: true }));

app.use(bodyParser.urlencoded({
  limit: '20mb',
  extended: true
})); // parse application/x-www-form-urlencoded
app.use(methodOverride()); // must come after bodyParser

app.use(multer());

app.set('view engine', 'html');
app.set('views', __dirname + '/');
app.engine('html', hbs.__express);

app.use(express.static(__dirname + '/../public'));

require("./routes")(app, login);

http.globalAgent.maxSockets = 10

//server
http.createServer(app).listen(config.port, function() {
  console.log('Express server listening on port ' + config.port);
});

module.exports = app;
