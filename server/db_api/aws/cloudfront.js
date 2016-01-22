module.exports = function(db) {

  var module = {};

  var AWS = require('aws-sdk');
  var uuid = require('uuid');
  var moment = require('moment');

  return {

    makeCloudfrontDistribution: function(credentials, domain, bucketName, callback) {
      //set keys before every action
      AWS.config.update({
        region: 'us-west-2',
        maxRetries: 0
      });
      AWS.config.update(credentials);
      var cloudfront_client = new AWS.CloudFront();

      var index_name = "index.html";

      var error;

      var callerRef = uuid.v4();

      var timestamp = moment().format();

      var s3_id = 'S3-' + bucketName;
      var s3_domain = bucketName + '.s3.amazonaws.com';

      var params = {
        DistributionConfig: { /* required */
          CallerReference: callerRef,
          /* required */
          Comment: 'Created by Lander DS on ' + timestamp,
          /* required */
          DefaultCacheBehavior: { /* required */
            ForwardedValues: { /* required */
              Cookies: { /* required */
                Forward: 'none' /* required */
              },
              QueryString: false,
              /* required */
            },
            MinTTL: 0,
            /* required */
            TargetOriginId: s3_id,
            /* required */
            TrustedSigners: { /* required */
              Enabled: false,
              /* required */
              Quantity: 0 /* required */
            },
            ViewerProtocolPolicy: 'allow-all',
            /* required */
            AllowedMethods: {
              Items: [ /* required */
                'GET', 'HEAD'
                /* more items */
              ],
              Quantity: 2,
              /* required */
              CachedMethods: {
                Items: [ /* required */
                  'GET', 'HEAD'
                  /* more items */
                ],
                Quantity: 2 /* required */
              }
            },
            DefaultTTL: 86400,
            MaxTTL: 31536000,
            SmoothStreaming: false,
            Compress: true
          },
          Enabled: true,
          /* required */
          Origins: { /* required */
            Quantity: 1,
            /* required */
            Items: [{
                DomainName: s3_domain,
                /* required */
                Id: s3_id,
                /* required */
                OriginPath: '',
                S3OriginConfig: {
                  OriginAccessIdentity: '' /* required */
                }
              }
              /* more items */
            ]
          },
          Aliases: {
            Quantity: 2,
            /* required */
            Items: [
              domain,
              'www.' + domain
              /* more items */
            ]
          },
          DefaultRootObject: index_name,
          PriceClass: 'PriceClass_All'
        }
      };

      cloudfront_client.createDistribution(params, function(err, data) {
        if (err) {
          console.log(err, err.stack);
          error = "Error creating cloudfront distribution from bucket: " + bucketName;
          callback(error, {});
        } else {
          callback(error, data.DomainName, data.Id);
        }
      });
    },

    deleteCloudfrontDistribution: function(credentials, domain, bucketName, callback) {
      //set keys before every action
      AWS.config.update({
        region: 'us-west-2',
        maxRetries: 0
      });
      AWS.config.update(credentials);
      var cloudfront_client = new AWS.CloudFront();

      var params = {
        Id: 'STRING_VALUE',
        /* required */
        IfMatch: 'STRING_VALUE'
      };
      cloudfront.deleteDistribution(params, function(err, data) {
        if (err) {
        console.log(err, err.stack); // an error occurred
      } else {
        console.log(data); // successful response
        callback(false);
      }
      });


    }

  }
}
