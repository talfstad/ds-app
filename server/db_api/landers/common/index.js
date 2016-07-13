module.exports = function(app, db) {

    var module = {};

    module.add_lander = require('./add_lander')(app, db);
    
    return module;

}