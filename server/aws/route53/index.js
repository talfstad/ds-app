module.exports = function(app, dbApi) {
  
  var base = require("./base")(app);

  return _.extend({

    //any code that require base to be used
   
  }, base);
};