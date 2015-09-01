//module dependencies
var express = require("express");
var http = require("http");
var path = require("path");
var app = express();
var hbs = require("hbs");
var logger = require('morgan');
var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var multer = require('multer');

var config = require("./config");
var db = require("./db_api");



var login = require("./login");
login.initialize(app, db);

app.use(methodOverride());
app.use(require('cookie-parser')());

app.use(bodyParser.json({
  limit: '20mb'
}));



app.use(bodyParser.urlencoded({
  limit: '20mb',
  extended: true
})); // parse application/x-www-form-urlencoded

app.use(multer());

app.set('view engine', 'html');
app.set('views', __dirname + '/');
app.engine('html', hbs.__express);

app.use(express.static(__dirname + '/../public'));

var routes = require("./routes");
routes.initialize(app, db, login);

//server
http.createServer(app).listen(config.port, function() {
  console.log('Express server listening on port ' + config.port);
});

module.exports = app;
