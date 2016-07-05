module.exports = function(db) {

    var module = {};

    module.add_lander = require('./add_lander')(db);
    
    return module;

}