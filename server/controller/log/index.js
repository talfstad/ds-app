module.exports = function(app, dbApi, awsApi) {

  var module = {
  	add_lander: require("./add_lander")(app, dbApi, awsApi),
  	rip: require("./rip")(app, dbApi, awsApi)
  };

  return module;
}