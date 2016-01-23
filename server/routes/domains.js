module.exports = function(app, passport) {
  var module = {};

  var db = require("../db_api");
  var uuid = require('uuid');


  app.get('/api/domains', passport.isAuthenticated(), function(req, res) {
    var user = req.user;
    db.domains.getAll(user, function(rows) {
      res.json(rows);
    });
  });

  //saving a new domain!
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

    if (!checkIsValidDomain(domain)) {

      console.log("domain invalid");

      res.json({
        error: {
          code: "domainInvalid",
          msg: "Please enter a valid domain name"
        }
      });

    } else {

      console.log("domain: " + domain);


      //used to gather all new attributes before saving to db
      //during aws calls
      var newDomainData = {};
      newDomainData.domain = domain;

      //0. get AWS credentials
      db.aws.keys.getAmazonApiKeys(user, function(awsKeyData) {

        var credentials = {
          accessKeyId: awsKeyData.aws_access_key_id,
          secretAccessKey: awsKeyData.aws_secret_access_key
        }

        //generate a unique bucket name for user, make sure it is a valid bucket name
        var bucketName = uuid.v4();


        //1. create a bucket
        db.aws.s3.createBucket(credentials, bucketName, function(err, responseData) {
          if (err) {

            res.json({
              error: {
                code: "couldNotCreateS3Bucket",
                msg: err
              }
            });

          } else {

            //save the bucket link
            var bucketUrl = responseData.Location;
            newDomainData.bucketUrl = bucketUrl;

            //2. add website configuration to the bucket
            db.aws.s3.createBucketWebsite(credentials, bucketName, function(err, data) {
              if (err) {
                //if fail remove bucket
                db.aws.s3.deleteBucket(credentials, bucketName, function(errDeleteBucket, responseData) {
                  if (errDeleteBucket) {
                    //oh shit error
                    res.json({
                      error: {
                        code: "couldNotDeleteS3Bucket",
                        msg: errDeleteBucket
                      }
                    });
                  } else {
                    //normal error
                    res.json({
                      error: {
                        code: "couldNotCreateCloudfrontDistribution",
                        msg: err
                      }
                    });
                  }
                });

              } else {

                //2. create a cloud front for domain
                db.aws.cloudfront.makeCloudfrontDistribution(credentials, domain, bucketName, function(err, cloudfrontDomainName, cloudfrontId) {
                  if (err) {
                    //if fail remove bucket
                    db.aws.s3.deleteBucket(credentials, bucketName, function(errDeleteBucket, responseData) {
                      if (errDeleteBucket) {
                        //oh shit error
                        res.json({
                          error: {
                            code: "couldNotDeleteS3Bucket",
                            msg: errDeleteBucket
                          }
                        });
                      } else {
                        //normal error
                        res.json({
                          error: {
                            code: "couldNotCreateCloudfrontDistribution",
                            msg: err
                          }
                        });
                      }
                    });

                  } else {
                    console.log("successfully created cloudfront distribution " + cloudfrontDomainName + " id: " + cloudfrontId);

                    //store this for adding to domain table later
                    newDomainData.cloudfrontDomainName = cloudfrontDomainName;
                    newDomainData.cloudfrontId = cloudfrontId;

                    //3. create the route 53 for that
                    db.aws.route53.createHostedZone(credentials, domain, cloudfrontDomainName, function(err, nameservers) {
                      if (err) {
                        //if fail remove bucket & cloud front
                        db.aws.s3.deleteBucket(credentials, bucketName, function(errDeleteBucket) {
                          if (errDeleteBucket) {
                            //oh shit error
                            res.json({
                              error: {
                                code: "couldNotDeleteS3Bucket",
                                msg: errDeleteBucket
                              }
                            });
                          } else {
                            //delete cloud front
                            console.log("trying ot delete cloudfront");
                            db.aws.cloudfront.deleteCloudfrontDistribution(credentials, cloudfrontId, function(errDeleteCloudfront) {
                              console.log("successfully deleted cloudfront distribution " + cloudfrontId);
                              if (errDeleteCloudfront) {
                                //oh shit error
                                res.json({
                                  error: {
                                    code: "errDeleteCloudfront",
                                    msg: errDeleteCloudfront
                                  }
                                });
                              } else {
                                //normal error
                                res.json({
                                  error: {
                                    code: "couldNotCreateHostedZone",
                                    msg: err
                                  }
                                });
                              }
                            });
                          }
                        });
                      } else {
                        console.log("successfully created hosted zone " + nameservers);

                        newDomainData.nameservers = nameservers;

                        //4. save it all to db for reference
                        db.domains.addNewDomain(user, newDomainData, function(responseData) {

                          console.log("added domain to database");

                          //5. return the data with an id, etc to the gui model
                          res.json(responseData);

                        });
                      }
                    });
                  }
                });
              }
            });
          }
        });
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
