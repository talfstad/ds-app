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
              callback(err);
            } else {
              callback(error, data.ResourceRecordSets);
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
                  callback(error, nameservers, hostedZoneId);
                }
              });
            }
          });
        } else {
          error = "Error creating hosted zone (no data): " + domain;
          callback(error, {});
        }
      });

    },


    //removes a domains CNAME and A records so we can delete the hosted zone!
    deleteRecordSets: function(credentials, hostedZoneId, callback) {

      var timestamp = moment().format();

      AWS.config.update({
        region: 'us-west-2',
        maxRetries: 0
      });

      AWS.config.update(credentials);

      var route53 = new AWS.Route53();

      //first get all record sets with A or CNAME
      var params = {
        HostedZoneId: hostedZoneId,
        /* required */
        MaxItems: '100',
      };

      route53.listResourceRecordSets(params, function(err, data) {
        if (err) {
          callback(err);
        } else {
          //inclue all sets except NS
          var resourceRecordSets = [];
          for (var i = 0; i < data.ResourceRecordSets.length; i++) {
            if (data.ResourceRecordSets[i].Type !== "NS" && data.ResourceRecordSets[i].Type !== "SOA") {

              resourceRecordSets.push(data.ResourceRecordSets[i]);
            }
          }

          //delete them! 
          //format them for delete
          var recordsFormattedForDelete = [];
          for (var i = 0; i < resourceRecordSets.length; i++) {
            //remove resource records if empty
            if (resourceRecordSets[i].ResourceRecords.length <= 0) {
              delete resourceRecordSets[i].ResourceRecords
            }

            var record = {};
            record.Action = "DELETE";
            record.ResourceRecordSet = resourceRecordSets[i]
            recordsFormattedForDelete.push(record);
          }

          var params = {
            ChangeBatch: {
              Changes: recordsFormattedForDelete
            },
            HostedZoneId: hostedZoneId
          }


          if (resourceRecordSets.length > 0) {
            route53.changeResourceRecordSets(params, function(err, data) {
              if (err) {
                callback(err);
              } else {
                callback(false, true);
              }
            });
          }
        }
      });

    },

    deleteHostedZone: function(credentials, hostedZoneId, callback) {
      AWS.config.update({
        region: 'us-west-2',
        maxRetries: 0
      });

      AWS.config.update(credentials);

      var route53 = new AWS.Route53();

      //delete all hosted zone record sets first!
      this.deleteRecordSets(credentials, hostedZoneId, function(err, data) {

        var params = {
          Id: hostedZoneId /* required */
        };

        route53.deleteHostedZone(params, function(err, data) {
          if (err) {
            callback(err);
          } else {
            callback(false, data);
          }
        });

      });
    }

  }
}
