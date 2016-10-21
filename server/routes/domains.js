module.exports = function(app, passport, dbApi, controller) {
  var module = {};

  var uuid = require('uuid');


  app.get('/api/domains', passport.isAuthenticated(), function(req, res) {

    var user = req.user;
    var user_id = user.id;

    dbApi.users.findById(user_id, function(err, userData) {

      dbApi.domains.getAll(user, user.aws_root_bucket, function(err, rows) {
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



      //0. get AWS credentials
      dbApi.aws.keys.getAmazonApiKeysAndRootBucket(user, function(err, awsData) {
        if (err) {
          res.json({
            error: err
          });
        } else {

          //used to gather all new attributes before saving to db
          //during aws calls
          var newDomainData = {};
          newDomainData.domain = domain;

          var credentials = {
            accessKeyId: awsData.aws_access_key_id,
            secretAccessKey: awsData.aws_secret_access_key
          }
          var rootBucket = awsData.aws_root_bucket;
          var path = "domains/" + domain;

          //check if domain has already been added as a root domain. if so, add it as a subdomain
          dbApi.domains.checkIfSubdomain(rootBucket, domain, function(err, domainInformation) {
            if (err) {
              res.json({
                error: err
              });
            } else {
              //1. create domain folder in root landerDS bucket /domains/<domain_folder>
              controller.aws.s3.addNewDomainFolderToS3(credentials, rootBucket, path + "/", function(err) {
                if (err) {
                  res.json({
                    error: err
                  });
                } else {
                  //save the bucket link
                  newDomainData.path = path;
                  newDomainData.rootBucket = rootBucket;

                  //2. create a cloud front for domain
                  controller.aws.cloudfront.makeCloudfrontDistribution(credentials, domain, "/" + path, rootBucket, function(err, cloudfrontDomainName, cloudfrontId) {
                    if (err) {
                      res.json({
                        error: {
                          code: "couldNotCreateCloudfrontDistribution",
                          msg: err
                        }
                      });
                    } else {
                      //store this for adding to domain table later
                      newDomainData.cloudfront_domain = cloudfrontDomainName;
                      newDomainData.cloudfrontId = cloudfrontId;

                      if (domainInformation.isSubdomain) {
                        //add A DNS record to the domain's hosted zone for this subdomain aliased to the new CF distribution :D
                        controller.aws.route53.addSubdomainRecord(credentials, domain, cloudfrontDomainName, domainInformation.hosted_zone_id, function(err, responseData) {
                          if (err) {
                            //error so remove CF distro
                            controller.aws.cloudfront.deleteDistribution(credentials, cloudfrontId, function(err) {
                              res.json({
                                error: err
                              });
                            });
                          } else {
                            newDomainData.nameservers = domainInformation.nameservers.split(',');
                            newDomainData.hostedZoneId = domainInformation.hosted_zone_id;

                            dbApi.domains.addNewDomain(user, newDomainData, function(err, responseData) {
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
                      } else {
                        //3. create the route 53 for that if not subdomain
                        controller.aws.route53.createHostedZone(credentials, domain, cloudfrontDomainName, function(err, nameservers, hostedZoneId) {
                          if (err) {
                            //error so remove CF distro
                            controller.aws.cloudfront.deleteDistribution(credentials, cloudfrontId, function(err) {
                              res.json({
                                error: err
                              });
                            });
                          } else {
                            newDomainData.nameservers = nameservers;
                            newDomainData.hostedZoneId = hostedZoneId;

                            //4. save it all to db for reference
                            dbApi.domains.addNewDomain(user, newDomainData, function(err, responseData) {
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

    dbApi.domains.saveDomain(user, modelAtributes, function() {
      res.json(modelAtributes);
    });

  });

  app.get('/api/domains/notes/:id', passport.isAuthenticated(), function(req, res) {
    var user = req.user;
    var domain_id = req.params['id'];

    dbApi.domains.getDomainNotes(user.aws_root_bucket, domain_id, function(err, dbDomainNotes) {
      if (err) {
        res.json({ error: { code: "CouldNotGetNotes" } });
      } else {
        res.json({ notes: dbDomainNotes });
      }
    });
  });

  app.put('/api/domains/notes/:id', passport.isAuthenticated(), function(req, res) {
    var user = req.user;
    var domainData = req.body;
    var notes = domainData.notes;
    var notes_search = domainData.notes_search;
    //save lander data
    dbApi.domains.updateNotes(user.aws_root_bucket, domainData, function(err) {
      res.json({});
    });
  });

  return module;

}
