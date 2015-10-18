module.exports = function(db) {
  
  var config = require('../config');

  return {

    registerJob: function(user, modelAttributes, successCallback, errorCallback) {
      var user_id = user.id;

      //set processing true to start processing on response
      modelAttributes.processing = true;

      //param order: working_node_id, action, processing, lander_id, domain_id, campaign_id, user_id
      db.query("CALL register_job(?, ?, ?, ?, ?, ?, ?)", [config.id, modelAttributes.action, true, modelAttributes.lander_id, modelAttributes.domain_id, null, user_id],

        function(err, docs) {
          if (err) {
            console.log(err);
            errorCallback("Error registering new job in DB call");
          } else {
              modelAttributes.id = docs[0][0]["LAST_INSERT_ID()"];

              console.log("SHOULD BE HERE: " + docs[0][0]["LAST_INSERT_ID()"]);
              successCallback(modelAttributes);
          }
        });
    },

    finishedProcessing: function(user, finishedJobs, successCallback, errorCallback){
      var user_id = user.id;

      if(finishedJobs.length > 0) {
        //build sql command
        var finishedJobsValues = [false];

        var updateSql = "UPDATE jobs SET processing= ? WHERE ";
        

        for(var i=0 ; i<finishedJobs.length ; i++){
          updateSql = updateSql.concat("id = ?");

          if((i+1)<finishedJobs.length){
            updateSql = updateSql.concat(" OR ");
          }

          finishedJobsValues.push(finishedJobs[i].id);

          //update processing *guaranteed bc returning to client only on success*
          finishedJobs[i].processing = false;
        }

        console.log("finished QUERY: " + updateSql + JSON.stringify(finishedJobsValues));

        db.query(updateSql, finishedJobsValues, function(err, docs){
          if(err){
            console.log(err);
            errorCallback("Error finishing processing on job in DB call")
          } else {
            //processing key updated above
            successCallback();
          }
        });
      } else {
        successCallback();
      }
    }
  }

};
