module.exports = function(db) {

  var module = {};

  var s3 = require('s3');
  var AWS = require('aws-sdk');
  var moment = require('moment');
  var make_uuid = require('uuid');

  return {

    createHostedZone: function(credentials, domain, cloudfront_domain_name, callback) {

      //function definitions for creating hosted zone
      var getNameServers = function(hostedZoneId, callback) {
          var params = {
            HostedZoneId: hostedZoneId /* required */
          };
          var error;
          route53.listResourceRecordSets(params, function(err, data) {
            if (err) {
              console.log("Error listing record sets for hosted zone id: " + hostedZoneId);
              callback(err, {})
            } else {
              callback(error, data.ResourceRecordSets)
            }
          });
        }
        ////////////////////////////////

      var error;

      var timestamp = moment().format();
      var callerRef = make_uuid.v4();

      AWS.config.update({
        region: 'us-west-2',
        maxRetries: 0
      });

      AWS.config.update(credentials);

      var route53 = new AWS.Route53();

      var hostedZoneParams = {
        CallerReference: callerRef,
        /* required */
        Name: domain,
        /* required */
        HostedZoneConfig: {
          Comment: 'Created by the Lander DS on ' + timestamp
        }
      };

      route53.createHostedZone(hostedZoneParams, function(err, data) {
        if (err) {
          console.log(err, err.stack);
          error = "Error creating hosted zone: " + domain;
          callback(error, {});
          return;
        } else if (data) {

          //cloudfront hosted zone is always this
          var cloudfrontHostedZoneId = 'Z2FDTNDATAQYW2';

          var nameservers;

          if (data.DelegationSet) {
            nameservers = data.DelegationSet.NameServers;
          } else {
            error = "No nameservers for hosted zone with id: " + hostedZoneId;
            callback(error, {});
          }

          var hostedZoneId = data.HostedZone.Id;
          //var arr = hostedZoneId.split('/');
          //hostedZoneId = arr[arr.length - 1];

          var recordSetParams = {
            ChangeBatch: { /* required */
              Changes: [ /* required */ {
                  Action: 'UPSERT',
                  /* required */
                  ResourceRecordSet: { /* required */
                    Name: domain,
                    /* required */
                    Type: 'A',
                    /* required */
                    AliasTarget: {
                      DNSName: cloudfront_domain_name,
                      /* required */
                      EvaluateTargetHealth: false,
                      /* required */
                      HostedZoneId: cloudfrontHostedZoneId /* required */
                    }
                  }
                },
                /* required */
                {
                  Action: 'UPSERT',
                  /* required */
                  ResourceRecordSet: { /* required */
                    Name: 'www.' + domain,
                    /* required */
                    Type: 'CNAME',
                    ResourceRecords: [{
                      Value: cloudfront_domain_name /* required */
                    }],
                    TTL: 0
                  }
                }
                /* more items */
              ],
              Comment: 'Added by Lander DS on ' + timestamp
            },
            HostedZoneId: hostedZoneId /* required */
          };

          route53.changeResourceRecordSets(recordSetParams, function(err, data) {
            if (err) {
              console.log(err, err.stack);
              error = "Error adding record set for: " + cloudfront_domain_name;
              callback(error, {});
            } else {
              getNameServers(hostedZoneId, function(err, recordSets) {
                if (err) {
                  callback(err, {})
                } else {
                  callback(error, nameservers);
                }
              });
            }
          });
        } else {
          error = "Error creating hosted zone (no data): " + domain;
          callback(error, {});
        }
      });

    }

  }
}
