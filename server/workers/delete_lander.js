module.exports = function(app, db) {

  var module = {};

  var config = require("../config");

  module.deleteLander = function(user, attr) {


    console.log("now working delete lander job");

    // 1. undeploy from all domains
    // 2. delete from s3 preview bucket
    // 3. remove lander from DB, cascade all related to delete as well

    var user_id = user.id;
    var lander_id = attr.lander_id;

    db.landers.deleteLander(user_id, lander_id, function() {
      //successCB

      var finishedJobs = [attr.id];
    
      db.jobs.finishedJobSuccessfully(user, finishedJobs, function() {
    
        console.log("successfully updated deleteLander job to finished");
    
      });



    }, function() {
      //errorCB
      console.log("Error deleting lander with id: " + lander_id);
    });

  };

  return module.deleteLander;

}
