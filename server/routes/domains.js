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
          //return res.json error here

        } else {
          
          //save the bucket link
          var bucketUrl = responseData.Location;
          newDomainData.bucketUrl = bucketUrl;

          //2. create a cloud front for domain
          db.aws.cloudfront.makeCloudfrontDistribution(credentials, domain, bucketName, function(error, cloudfrontDomainName) {

            console.log("successfully created cloud front distrobution");


          });


        }


      });



      //if fail remove bucket

      //3. create the route 53 for that
      //if fail remove bucket & cloud front

      //4. save it all to db for reference


      //5. return the data to the gui


    });



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
