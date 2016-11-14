module.exports = function(app, db) {

  var module = {
    add_domain: require('./add_domain')(app, db),
    delete_domain: require('./delete_domain')(app, db)
  };

  return module;
}