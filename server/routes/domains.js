module.exports = function(app, passport) {
  var module = {};

  var db = require("../db_api");
  var uuid = require('uuid');


  app.get('/api/domains', passport.isAuthenticated(), function(req, res) {
    var user = req.user;
    var user_id = user.id;

    db.users.findById(user_id, function(err, userData) {

      db.domains.getAll(user, user.aws_root_bucket, function(err, rows) {
        if (err) {
          res.json({
            error: {
              code: "FailedToGetDomains",
            }
          });
        } else {
          res.json(rows);
        }
      });
    });

  });

  //adding a new domain!
  app.post('/api/domains', passport.isAuthenticated(), function(req, res) {

    var user = req.user;

    //validate domain TODO
    var domain = req.body.domain;

    function checkIsValidDomain(domain) {
      var re = new RegExp(/^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})$/);
      return domain.match(re);
    }

    //cut off the http or https & www if its there
    domain = domain.replace('https://', '');
    domain = domain.replace('http://', '');
    domain = domain.replace('www.', '');
    domain = domain.toLowerCase();

    if (!checkIsValidDomain(domain)) {

      res.json({
        error: {
          code: "DomainInvalid",
          msg: "Please enter a valid domain name"
        }
      });

    } else {

      //used to gather all new attributes before saving to db
      //during aws calls
      var newDomainData = {};
      newDomainData.domain = domain;

      //0. get AWS credentials
      db.aws.keys.getAmazonApiKeysAndRootBucket(user, function(err, awsData) {
        if (err) {
          res.json({
            error: err
          });
        } else {

          var credentials = {
            accessKeyId: awsData.aws_access_key_id,
            secretAccessKey: awsData.aws_secret_access_key
          }
          var rootBucket = awsData.aws_root_bucket;
          var path = "domains/" + domain;
          //1. create domain folder in root landerDS bucket /domains/<domain_folder>
          db.aws.s3.addNewDomainFolderToS3(credentials, rootBucket, path + "/", function(err) {
            if (err) {
              res.json({
                error: err
              });
            } else {
              //save the bucket link
              newDomainData.path = path;
              newDomainData.rootBucket = rootBucket;
              //2. create a cloud front for domain
              db.aws.cloudfront.makeCloudfrontDistribution(credentials, domain, "/" + path, rootBucket, function(err, cloudfrontDomainName, cloudfrontId) {
                if (err) {
                  res.json({
                    error: {
                      code: "couldNotCreateCloudfrontDistribution",
                      msg: err
                    }
                  });
                } else {
                  //store this for adding to domain table later
                  newDomainData.cloudfrontDomainName = cloudfrontDomainName;
                  newDomainData.cloudfrontId = cloudfrontId;

                  //3. create the route 53 for that
                  db.aws.route53.createHostedZone(credentials, domain, cloudfrontDomainName, function(err, nameservers, hostedZoneId) {
                    if (err) {
                      //error so remove CF distro
                      db.aws.cloudfront.deleteDistribution(credentials, cloudfrontId, function(err) {
                        res.json({
                          error: err
                        });
                      });
                    } else {
                      newDomainData.nameservers = nameservers;
                      newDomainData.hostedZoneId = hostedZoneId;

                      //4. save it all to db for reference
                      db.domains.addNewDomain(user, newDomainData, function(err, responseData) {
                        if (err) {
                          res.json({
                            error: err
                          });
                        } else {
                          //5. return the data with an id, etc to the gui model
                          res.json(responseData);
                        }
                      });
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });

  app.put('/api/domains/:domain_id', passport.isAuthenticated(), function(req, res) {
    var user = req.user;

    var modelAtributes = req.body;

    db.domains.saveDomain(user, modelAtributes, function() {
      res.json(modelAtributes);
    });

  });

  app.delete('/api/domains', passport.isAuthenticated(), function(req, res) {

  });

  return module;

}
