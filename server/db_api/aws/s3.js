module.exports = function(db) {

  var module = {};

  var s3 = require('s3');
  var AWS = require('aws-sdk');


  //create client
  // var s3_client = s3.createClient({
  //   maxAsyncS3: 20, // this is the default
  //   s3RetryCount: 3, // this is the default
  //   s3RetryDelay: 1000, // this is the default
  //   multipartUploadThreshold: 20971520, // this is the default (20 MB)
  //   multipartUploadSize: 15728640, // this is the default (15 MB)
  //   s3Options: {
  //     accessKeyId: credentials.accessKeyId,
  //     secretAccessKey: credentials.secretAccessKey,
  //     // any other options are passed to new AWS.S3()
  //     // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
  //   },
  // });

  return {

    // 1. Bucket names must be at least 3 and no more than 63 characters long.
    // 2. Bucket names must be a series of one or more labels. Adjacent labels are 
    //separated by a single period (.). Bucket names can contain lowercase letters, 
    //numbers, and hyphens. Each label must start and end with a lowercase letter or a number.
    // 3. Bucket names must not be formatted as an IP address (e.g., 192.168.5.4).
    // 4. When using virtual hosted–style buckets with SSL, the SSL wild card certificate 
    //only matches buckets that do not contain periods. To work around this, use HTTP or write 
    //your own certificate verification logic.
    createBucket: function(credentials, bucketName, callback) {

      AWS.config.update({
        region: 'us-west-2',
        maxRetries: 0
      });
      AWS.config.update(credentials);

      var aws_s3_client = new AWS.S3();

      var params = {
        Bucket: bucketName,
        /* required */
        ACL: 'public-read'
      };

      aws_s3_client.createBucket(params, function(err, data) {
        if (err) {
          if (err.code == 'BucketAlreadyExists') {
            callback('Bucket already exists.');
          } else if (err.code == 'BucketAlreadyOwnedByYou') {
            //just move along, nothing to see here
            callback('Bucket already owned by me, moving to next step');
          } else {
            console.log(err, err.stack); // an error occurred
            callback("Failure creating bucket: " + bucketName)
          }

        } else {
          console.log("successfully created bucket"); // successful response
          callback(false, data);
        }
      });

    },

    //creates the website configuration for a bucket
    createBucketWebsite: function(credentials, bucketName, callback) {

      AWS.config.update({
        region: 'us-west-2',
        maxRetries: 0
      });
      AWS.config.update(credentials);

      var aws_s3_client = new AWS.S3();

      var params = {
        Bucket: bucketName,
        /* required */
        WebsiteConfiguration: { /* required */
          ErrorDocument: {
            Key: 'error.html' /* required */
          },
          IndexDocument: {
            Suffix: 'index.html' /* required */
          },
        }
      };

      aws_s3_client.putBucketWebsite(params, function(err, data){
        if(err){
          console.log(err, err.stack);
          callback("Failure deleting bucket: " + bucketName)

        } else {
          console.log("successfully configured bucket for website " + bucketName); // successful response
          callback(false, data);
        }
      });

    },

    deleteBucket: function(credentials, bucketName, callback) {

      AWS.config.update({
        region: 'us-west-2',
        maxRetries: 0
      });
      AWS.config.update(credentials);

      var aws_s3_client = new AWS.S3();

      var params = {
        Bucket: bucketName
      };

      aws_s3_client.deleteBucket(params, function(err, data) {

        if (err) {

          console.log(err, err.stack); // an error occurred
          callback("Failure deleting bucket: " + bucketName)

        } else {

          console.log("successfully deleted bucket" + bucketName); // successful response
          callback(false, data);

        }

      });

    }

  }
}
