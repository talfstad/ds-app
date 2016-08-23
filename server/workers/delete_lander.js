module.exports = function(app, db) {

  var module = {};

  module.deleteLander = function(user, attr) {

    var myJobId = attr.id;

    // var runJobCode = function() {


    console.log("running delete lander now T: ");

    //   db.jobs.getAllProcessingForLanderDomain(user, attr, function(jobs) {

    //     //get the lowest job id
    //     var lowestJobId = jobs[0].id;
    //     for (var i = 0; i < jobs.length; i++) {
    //       if (jobs[i].id < lowestJobId) {
    //         lowestJobId = jobs[i].id;
    //       }
    //     }

    //     if (myJobId <= lowestJobId) {
    //       clearInterval(interval);

    //       //job code starts here

    //       var user_id = user.id;
    //       var lander_id = attr.lander_id;

    //       db.landers.deleteLander(user_id, lander_id, function() {
    //         //successCB

    //         var finishedJobs = [attr.id];

    //         db.jobs.finishedJobSuccessfully(user, finishedJobs, function() {

    //           console.log("successfully updated deleteLander job to finished");

    //         });

    //       }, function() {
    //         //errorCB
    //         console.log("Error deleting lander with id: " + lander_id);
    //       });


    //       //end job code

    //     }

    //   });
    // }

    // //run once before interval starts
    // runJobCode();

    // var intervalPeriod = 1000 * 30 // 30 seconds
    // var interval = setInterval(function() {
    //   runJobCode();
    // }, intervalPeriod);



  };

  return module.deleteLander;

}
