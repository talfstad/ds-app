module.exports = function(app, db) {

  var module = {};

  module.ripLander = function(user, attr, callback) {
    // var job = attr.job;
    // var landerData = attr.lander;

    // var myJobId = job.id;
    // var lander_id = job.lander_id;

    console.log("\n\n\nHERE ARE YOUR data: " + JSON.stringify(attr) + "\n\n\n");

    //optimize lander and return new numbers for pagespeed!!

    //create staging dir
    // db.common.createStagingArea(function(err, stagingPath, stagingDir) {

    //   db.aws.keys.getAmazonApiKeysAndRootBucket(user, function(err, awsData) {
    //     if (err) {
    //       callback(err, [myJobId]);
    //     } else {

    //       var username = user.user;
    //       var baseBucketName = awsData.aws_root_bucket;

    //       var directory = "landers/" + landerData.s3_folder_name + "/original";

    //       var credentials = {
    //         accessKeyId: awsData.aws_access_key_id,
    //         secretAccessKey: awsData.aws_secret_access_key
    //       }

    //       //copy the data down from the old s3, then push it to the new
    //       db.aws.s3.copyDirFromS3ToStaging(lander_id, stagingPath, credentials, username, baseBucketName, directory, function(err) {
    //         if (err) {
    //           callback(err, [myJobId]);
    //         } else {
    //           var deleteStaging = false;
    //           db.landers.common.add_lander.addOptimizePushSave(deleteStaging, user, stagingPath, landerData.s3_folder_name, landerData, function(err, data) {
    //             if (err) {
    //               callback(err, [myJobId]);
    //             } else {
    //               db.jobs.updateDeployStatus(user, myJobId, "deployed", function(err) {
    //                 if (err) {
    //                   callback(err, [myJobId]);
    //                 } else {
    //                   console.log("FINISHED ! saving lander job !");
    //                   callback(false, [myJobId]);
    //                 }
    //               });
    //             }
    //           });
    //         }
    //       });
    //     }
    //   });

    // });

  };

  return module.ripLander;

}
