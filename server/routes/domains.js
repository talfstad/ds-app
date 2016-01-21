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

    //cut off the http or https if its there
    domain = domain.replace('https://', '');
    domain = domain.replace('http://', '');
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

            //2. create a cloud front for domain
            db.aws.cloudfront.makeCloudfrontDistribution(credentials, domain, bucketName, function(err, cloudfrontDomainName) {
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
                console.log("successfully created cloudfront distribution")

                //3. create the route 53 for that

              }


            });


          }


        });



        

        
        //if fail remove bucket & cloud front

        //4. save it all to db for reference


        //5. return the data to the gui


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
