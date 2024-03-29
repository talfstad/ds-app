module.exports = function(app, dbApi, Worker, controller) {
  var module = {};

  module.allJobs = function(user, jobModelAttributes, callback) {
    var isError = false;

    var errorResponse = {
      error: {
        code: false
      }
    };

    var list = jobModelAttributes.list;
    var action = jobModelAttributes.action;

    var doneValidating = function() {
      if (isError) {
        callback(errorResponse);
      } else {
        callback(false);
      }
    };

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
      doneValidating();

    } else if (action == "deleteDomain") {

      var list = jobModelAttributes.list;

      if (list.length > 0) {
        var domain_id = list[0].domain_id;

        dbApi.domains.isDuplicateDeleteDomainJob(domain_id, function(err, isDuplicate) {
          if (err) {
            isError = true;
            errorResponse.code = "DbDuplicateDeleteDomainJobErr";
          } else {
            if (isDuplicate) {
              isError = true;
              errorResponse.code = "DuplicateDeleteDomainJob";
            }
          }
          doneValidating();
        });

      } else {
        doneValidating();
      }

    } else if (action == "deleteLander") {

      doneValidating();


    } else {
      doneValidating();
    }
  };

  return module;
};
