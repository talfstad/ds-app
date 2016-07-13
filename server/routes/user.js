module.exports = function(app, passport) {
  var module = {};

  var db = require("../db_api")(app);


  //update aws access keys for user
  app.post('/api/updateAccessKeys', passport.isAuthenticated(), function(req, res) {
    var user = req.user;
    var user_id = user.id;

    var newAccessKeyId = req.body.accessKeyId;
    var newSecretAccessKey = req.body.secretAccessKey;
    var newCredentials = {
      accessKeyId: newAccessKeyId,
      secretAccessKey: newSecretAccessKey
    };

    //1. if not first time adding keys, back up user's landerDS user folder 
    db.aws.keys.getAmazonApiKeysAndRootBucket(user, function(err, awsData) {

      var oldCredentials = {
        accessKeyId: awsData.aws_access_key_id,
        secretAccessKey: awsData.aws_secret_access_key
      };
      var currentRootBucket = awsData.aws_root_bucket;
      //only update if we don't have the same keys
      if (oldCredentials.accessKeyId !== newCredentials.accessKeyId) {
        //adds user folder to new account &
        //makes sure new account is set up correctly
        db.aws.s3.copyUserFolderToNewAccount(oldCredentials, newCredentials, currentRootBucket, user, function(err, newRootBucket) {
          if (err) {
            res.json({
              error: err
            });
          } else {
            //update keys to new keys in db
            db.aws.keys.updateAccessKeysAndRootBucket(user, newCredentials.accessKeyId, newCredentials.secretAccessKey, newRootBucket, function(err, result) {
              if (err) {
                res.json({
                  error: err
                });
              } else {
                //successful return
                res.json({"aws_root_bucket": newRootBucket});
              }
            });
          }
        });
      } else {
        res.json({
          error: {
            'code': "KeysAlreadyCurrent"
          }
        })
      }
    });

  });


  //gets the access keys
  app.get('/api/updateAccessKeys', passport.isAuthenticated(), function(req, res) {

    var user = req.user;

    db.aws.keys.getAmazonApiKeys(user, function(err, response) {
      if (err) {
        res.json({
          error: err
        });
      } else {
        res.json(response);
      }
    });

  });

};
