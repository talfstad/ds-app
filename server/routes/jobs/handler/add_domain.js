module.exports = function(app, dbApi, Worker, controller) {

  var addDomain = function(user, jobModelAttributes, callback) {

    //validate the ripped input data
    var domain = jobModelAttributes.domain;

    //validation
    function checkIsValidDomain(domain) {
      var re = new RegExp(/^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})$/);
      return domain.match(re);
    }

    //cut off the http or https & www if its there
    domain = domain.replace('https://', '');
    domain = domain.replace('http://', '');
    domain = domain.replace('www.', '');
    domain = domain.toLowerCase();

    if (checkIsValidDomain(domain)) {


      //is this a sub domain ?


      //yes: add the subdomain, check if domain is added if not then add the domain as well

      //no: add the root domain




      //test subdomain, add domain(s) to db, return success start job

      //if root domain already added this test will come back true if subdomain, means only add the subdomian not the root
      dbApi.domains.checkIfSubdomain(rootBucket, domain, function(err, domainInformation) {
        if (err) {
          res.json({
            error: err
          });
        } else {





        }
      });



      //starting job inludes subdomain info if it has it and adds subdomain record if necessary
      //if adding just a subdomain and domain exists then it will just add the subdomain record in the job





    } else {
      callback({
        error: {
          code: "InvalidInputs"
        }
      });
    }
  };

  return addDomain;
};
