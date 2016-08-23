module.exports = function(app, passport) {
  var module = {};

  module.allJobs = function(jobModelAttributes, callback) {
    var isError = false;

    var errorResponse = {
      error: {
        code: false
      }
    };

    var list = jobModelAttributes.list;
    var action = jobModelAttributes.action;


    if (action == "deployLanderToDomain" || action == "undeployLanderFromDomain") {

      //validate the jobs in list key have domain_id and lander_id

      _.each(list, function(jobAttr) {
        //error if any job doesnt have both lander_id and domain_id
        if (!jobAttr.domain_id || !jobAttr.lander_id || !jobAttr.action) {
          isError = true;
          errorResponse.error.code = "InvalidJobInputs";
          app.log("error creating job", "debug");
        }
        
        return isError;
      });
    }

    if (isError) {
      callback(errorResponse);
    } else {
      callback(false);
    }

    // "addActiveCampaignModel": false,
    // "neverAddToUpdater": true,
    // "processing": false,
    // "lander_id": "",
    // "campaign_id": "",
    // "domain_id": "",
    // "lander_url": "",
    // "extra": {},
    // "no_action_on_finish": false

    //   "list": [{
    //     "lander_id": 357,
    //     "domain_id": "153",
    //     "action": "deployLanderToDomain",
    //     "deploy_status": "deploying",
    //     "new": true
    //   }, {
    //     "lander_id": 357,
    //     "domain_id": "143",
    //     "action": "deployLanderToDomain",
    //     "deploy_status": "deploying",
    //     "new": true
    //   }],


  };


  return module;
};
