module.exports = function(app, db) {

  var module = {};

  var s3 = require('s3');
  var AWS = require('aws-sdk');
  var moment = require('moment');
  var make_uuid = require('uuid');

  return {

    createHostedZone: function(credentials, domain, cloudfront_domain_name, callback) {

      var error;

      var timestamp = moment().format();
      var callerRef = make_uuid.v4();

      AWS.config.update({
        region: 'us-west-2',
        maxRetries: 0
      });

      AWS.config.update(credentials);

      var route53 = new AWS.Route53();

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

    addSubdomainRecord: function(credentials, subdomain, cloudfrontDomainName, hostedZoneId, callback) {
      var timestamp = moment().format();
      console.log("hosted zone id: " + hostedZoneId);

      //cloudfront hosted zone is always this
      var cloudfrontHostedZoneId = 'Z2FDTNDATAQYW2';

      AWS.config.update({
        region: 'us-west-2',
        maxRetries: 0
      });

      AWS.config.update(credentials);

      var route53 = new AWS.Route53();

      var recordSetParams = {
        ChangeBatch: { /* required */
          Changes: [ /* required */ {
            Action: 'UPSERT',
            /* required */
            ResourceRecordSet: { /* required */
              Name: subdomain,
              /* required */
              Type: 'A',
              /* required */
              AliasTarget: {
                DNSName: cloudfrontDomainName,
                /* required */
                EvaluateTargetHealth: false,
                /* required */
                HostedZoneId: cloudfrontHostedZoneId /* required */
              }
            }
          }],
          Comment: 'Added by Lander DS on ' + timestamp
        },
        HostedZoneId: hostedZoneId /* required */
      };

      route53.changeResourceRecordSets(recordSetParams, function(err, data) {
        if (err) {
          callback({
            code: "ErrorAddingRecordSet"
          });
        } else {
          callback(false, data);
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
        app.log("got record sets to list " + err);
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
            app.log("changing resource record sets");
            route53.changeResourceRecordSets(params, function(err, data) {
              if (err) {
                callback(err);
              } else {
                callback(false);
              }
            });
          } else {
            callback(false);
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
      this.deleteRecordSets(credentials, hostedZoneId, function(err) {
        app.log("deleted hosted zones record sets: " + err);
        var params = {
          Id: hostedZoneId /* required */
        };

        route53.deleteHostedZone(params, function(err, data) {
          app.log("deleted hosted zone: " + err);
          if (err) {
            callback(err);
          } else {
            callback(false, data);
          }
        });

      });
    },

    deleteDomainRecordSets: function(credentials, domain, hostedZoneId, callback) {
      var me = this;
      var timestamp = moment().format();

      AWS.config.update({
        region: 'us-west-2',
        maxRetries: 0
      });

      AWS.config.update(credentials);

      var route53 = new AWS.Route53();

      //list record sets
      var params = {
        HostedZoneId: hostedZoneId /* required */
      };

      var error;

      route53.listResourceRecordSets(params, function(err, data) {
        if (err) {
          if (err.code === "NoSuchHostedZone") {
            //no error keep going if it doesnt exist
            callback(false, true);
          } else {
            callback(err);
          }
        } else {
          //find A record set that matches domain
          var resourceRecords = data.ResourceRecordSets;
          var recordsToDelete = [];
          for (var i = 0; i < resourceRecords.length; i++) {
            //only delete the exact records
            //weird theres a period at the end of the records when you get them
            if (resourceRecords[i].Name === domain + "." && resourceRecords[i].Type === "A") {

              delete resourceRecords[i].ResourceRecords;
              var record = {
                Action: "DELETE",
                ResourceRecordSet: resourceRecords[i]
              };
              recordsToDelete.push(record);
            }
          }

          //delete the actual records!
          var recordSetParams = {
            ChangeBatch: { /* required */
              Changes: recordsToDelete,
              Comment: 'Added by Lander DS on ' + timestamp
            },
            HostedZoneId: hostedZoneId /* required */
          };

          route53.changeResourceRecordSets(recordSetParams, function(err, data) {
            if (err) {
              console.log(err, err.stack);
              callback(error, {});
            } else {
              callback(false);
            }
          });
        }
      });

    },

    //list the hosted zone records, return the 
    getNumDomainsInHostedZone: function(credentials, hostedZoneId, callback) {
      var me = this;

      AWS.config.update({
        region: 'us-west-2',
        maxRetries: 0
      });

      AWS.config.update(credentials);

      var route53 = new AWS.Route53();

      var params = {
        HostedZoneId: hostedZoneId /* required */
      };

      route53.listResourceRecordSets(params, function(err, data) {
        if (err) {
          callback(err);
        } else {
          //count the A records:
          var resourceRecords = data.ResourceRecordSets;
          var count = 0;
          for (var i = 0; i < resourceRecords.length; i++) {
            if (resourceRecords[i].Type === "A") {
              count++;
            }
          }

          callback(false, count);
        }
      });
    },

    deleteHostedZoneInformationForDomain: function(credentials, domain, hostedZoneId, callback) {
      var me = this;

      AWS.config.update({
        region: 'us-west-2',
        maxRetries: 0
      });

      AWS.config.update(credentials);

      var route53 = new AWS.Route53();

      //check for other domains that are using this hosted zone
      this.getNumDomainsInHostedZone(credentials, hostedZoneId, function(err, numDomainsInHostedZone) {
        if (err) {
          if (err.code === "NoSuchHostedZone") {
            callback(false);
          } else {
            callback(err);
          }
        } else {

          if (numDomainsInHostedZone < 2) {
            console.log("deleting the hosted zone not just domain");
            //delete the hosted zone
            me.deleteHostedZone(credentials, hostedZoneId, function(err, deletedHostedZoneData) {
              if (err) {
                callback(err);
              } else {
                callback(false, deletedHostedZoneData);
              }
            });
          } else {
            console.log("deleting the domains record sets not the hosted zone");

            //delete just the domains record set
            me.deleteDomainRecordSets(credentials, domain, hostedZoneId, function(err, deletedRecordData) {
              if (err) {
                callback(err);
              } else {
                callback(false, deletedRecordData);
              }
            });
          }


        }
      });


      // this.deleteRecordSets(credentials, hostedZoneId, function(err, data) {

      //   var params = {
      //     Id: hostedZoneId /* required */
      //   };

      //   route53.deleteHostedZone(params, function(err, data) {
      //     if (err) {
      //       callback(err);
      //     } else {
      //       callback(false, data);
      //     }
      //   });

      // });
    }

  }
}
