module.exports = function(app, db) {

  var baseDeployedLander = require('./base_classes/base_deployed_lander')(app, db);

  var module = _.extend(baseDeployedLander, {

    //remove domain from all campaigns that have it
    removeActiveCampaignsForDomain: function(user, domain_id, callback) {
      var user_id = user.id;

      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        }
        connection.query("DELETE FROM campaigns_with_domains WHERE user_id = ? AND domain_id = ?", [user_id, domain_id],
          function(err, docs) {
            if (err) {
              callback(err);
            } else {
              callback(false, docs);
            }
            connection.release();
          });
      });

    },

    //remove all deployed_landers on that domain
    removeDeployedLandersFromDomain: function(user, domain_id, callback) {
      var user_id = user.id;

      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        }
        connection.query("DELETE FROM deployed_landers WHERE user_id = ? AND domain_id = ?", [user_id, domain_id],
          function(err, docs) {
            if (err) {
              callback(err);
            } else {
              callback(false, docs);
            }
            connection.release();
          });
      });

    },

    addNewDomain: function(user, newDomainAttributes, callback) {
      // console.log(newDomainAttributes);
      // {
      //   bucketUrl: 'http://f2e569da-f6d7-47af-bffb-486bcac07d67.s3.amazonaws.com/',
      //   cloudfrontDomainName: 'd1euhkwq20z1me.cloudfront.net',
      //   nameservers: ['ns-1177.awsdns-19.org',
      //     'ns-1715.awsdns-22.co.uk',
      //     'ns-800.awsdns-36.net',
      //     'ns-325.awsdns-40.com'
      //   ]
      // }

      //insert a new domain 
      var user_id = user.id;
      var domain = newDomainAttributes.domain;
      var cloudfront_domain = newDomainAttributes.cloudfrontDomainName;
      var cloudfront_id = newDomainAttributes.cloudfrontId;
      var nameservers = newDomainAttributes.nameservers.join();
      var hosted_zone_id = newDomainAttributes.hostedZoneId;
      var root_bucket = newDomainAttributes.rootBucket;


      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        }
        connection.query("call insert_new_domain(?, ?, ?, ?, ?, ?, ?)", [user_id, nameservers, domain, cloudfront_domain, cloudfront_id, hosted_zone_id, root_bucket],
          function(err, docs) {
            if (err) {
              callback({
                code: "CouldNotInsertIntoDb"
              });
            } else {
              newDomainAttributes.created_on = docs[1][0]["created_on"];
              newDomainAttributes.id = docs[0][0]["LAST_INSERT_ID()"];
              callback(false, newDomainAttributes);
            }
            connection.release();
          });
      });
    },

    //gets all for one domain
    getDomain: function(user, domain_id, callback) {
      var user_id = user.id;

      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        }
        connection.query("SELECT * FROM domains WHERE user_id = ? AND id = ?", [user_id, domain_id],
          function(err, dbDomainInfo) {
            if (err) {
              callback(err);
            } else {
              callback(false, dbDomainInfo[0]);
            }
            connection.release();
          });
      });
    },

    getSharedDomainInfo: function(domain_id, aws_root_bucket, callback) {
      console.log("domain_id: " + domain_id + " aws_root_bucket: " + aws_root_bucket)
      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        }
        connection.query("SELECT * FROM domains WHERE id = ? AND aws_root_bucket = ?", [domain_id, aws_root_bucket],
          function(err, dbDomainInfo) {
            if (err) {
              callback(err);
            } else {
              callback(false, dbDomainInfo[0]);
            }
            connection.release();
          });
      });
    },

    getAll: function(user, rootBucket, successCallback) {
      var user_id = user.id;

      var getAllLanderIdsForCampaign = function(campaign, callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          }
          connection.query("SELECT a.lander_id,b.name FROM landers_with_campaigns a JOIN landers b ON a.lander_id = b.id WHERE (a.user_id = ? AND a.campaign_id = ?)", [user_id, campaign.campaign_id],
            function(err, dbDomainIdsForCampaign) {
              if (err) {

              } else {
                callback(false, dbDomainIdsForCampaign);
              }
              connection.release();
            });
        });
      };

      var getActiveJobsForActiveCampaign = function(activeCampaign, domain, callback) {
        var campaign_id = activeCampaign.campaign_id || activeCampaign.id;
        var domain_id = domain.id;
        //get all jobs attached to lander and make sure only select those. list is:
        db.getConnection(function(err, connection) {
          if (err) {
            console.log(err);
          }
          connection.query("SELECT id,action,processing,deploy_status,lander_id,domain_id,campaign_id,done,error,created_on FROM jobs WHERE (user_id = ? AND campaign_id = ? AND domain_id = ? AND processing = ? AND (done IS NULL OR done = ?))", [user_id, campaign_id, domain_id, true, 0],
            function(err, dbActiveJobs) {
              if (err) {
                callback(err);
              } else {
                callback(false, dbActiveJobs);
                connection.release();
              }
            });
        });
      };

      getExtraNestedForActiveCampaign = function(activeCampaign, domain, callback) {
        getAllLanderIdsForCampaign(activeCampaign, function(err, deployedLanders) {
          if (err) {
            callback(err);
          } else {
            activeCampaign.deployedLanders = deployedLanders;

            getActiveJobsForActiveCampaign(activeCampaign, domain, function(err, activeJobs) {
              if (err) {
                callback(err);
              } else {
                activeCampaign.activeJobs = activeJobs;
                callback();
              }

            });
          }
        });
      };

      var getActiveCampaignsForDomain = function(domain, callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          }
          connection.query("SELECT a.id AS campaign_id, b.id, a.name,b.domain_id from campaigns a JOIN campaigns_with_domains b ON a.id=b.campaign_id WHERE (a.user_id = ? AND domain_id = ?);", [user_id, domain.id],
            function(err, dbActiveCampaigns) {

              if (dbActiveCampaigns.length <= 0) {
                callback(false, []);
              } else {
                var idx = 0;
                for (var i = 0; i < dbActiveCampaigns.length; i++) {
                  getExtraNestedForActiveCampaign(dbActiveCampaigns[i], domain, function() {
                    if (++idx == dbActiveCampaigns.length) {
                      callback(false, dbActiveCampaigns);
                    }
                  });
                }
              }
              connection.release();
            });
        });
      };


      var getActiveJobsForDomain = function(domain, callback) {
        //get all jobs attached to domain and make sure only select those. list is:
        // 1. deleteDomain
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("SELECT id,action,processing,deploy_status,lander_id,domain_id,campaign_id,done,error,created_on FROM jobs WHERE action = ? AND user_id = ? AND domain_id = ? AND processing = ? AND (done IS NULL OR done = ?)", ["deleteDomain", user_id, domain.id, true, 0],
              function(err, dbActiveJobs) {
                if (err) {
                  callback(err);
                } else {
                  if (dbActiveJobs <= 0) {
                    callback(false, []);
                  } else {
                    callback(false, dbActiveJobs);
                  }
                }
                connection.release();
              });
          }
        });
      };


      var getDeployedLandersForDomain = function(domain, callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("SELECT a.id, b.name, b.deployment_folder_name, b.modified, a.lander_id, a.domain_id FROM deployed_landers a JOIN landers b ON a.lander_id = b.id WHERE (a.user_id = ? AND a.domain_id = ?)", [user_id, domain.id],
              function(err, dbDeployedLanders) {
                if (dbDeployedLanders.length <= 0) {
                  callback(false, []);
                } else {
                  var idx = 0;
                  for (var i = 0; i < dbDeployedLanders.length; i++) {
                    module.getExtraNestedForDeployedLander(user, dbDeployedLanders[i], domain, function() {
                      if (++idx == dbDeployedLanders.length) {
                        callback(false, dbDeployedLanders);
                      }
                    });
                  }
                  if (dbDeployedLanders.length <= 0) {
                    callback(false, [dbDeployedLanders]);
                  }
                }
                connection.release();
              });
          }

        });
      };


      var getExtraNestedForDomain = function(domain, callback) {
        getDeployedLandersForDomain(domain, function(err, landers) {
          if (err) {
            callback(err);
          } else {
            domain.deployedLanders = landers;

            getActiveCampaignsForDomain(domain, function(err, activeCampaigns) {
              if (err) {
                callback(err);
              } else {
                domain.activeCampaigns = activeCampaigns;

                getActiveJobsForDomain(domain, function(err, activeJobs) {
                  if (err) {
                    callback(err);
                  } else {
                    domain.activeJobs = activeJobs;
                    callback();
                  }
                });
              }
            });
          }
        });
      };

      var getAllDomainsDb = function(callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            console.log(err);
          }
          connection.query("SELECT id,domain,nameservers,DATE_FORMAT(created_on, '%b %e, %Y %l:%i:%s %p') AS created_on FROM domains WHERE aws_root_bucket = ?", [rootBucket], function(err, dbdomains) {
            if (err) {
              callback(err);
            } else {
              var idx = 0;
              for (var i = 0; i < dbdomains.length; i++) {

                //set nameservers obj/parse correctly to ARRAY
                if (dbdomains[i].nameservers) {
                  var nameserversArray = dbdomains[i].nameservers.split(',');
                  dbdomains[i].nameservers = nameserversArray;
                }

                getExtraNestedForDomain(dbdomains[i], function(err) {
                  if (err) {
                    callback(err);
                  } else {
                    if (++idx == dbdomains.length) {
                      callback(false, dbdomains);
                    }
                  }
                });
              }
              if (dbdomains.length <= 0) {
                callback(false, dbdomains);
              }
            }
            connection.release();
          });
        });
      };


      //call to get all and return rows
      getAllDomainsDb(function(err, domains) {
        return successCallback(false, domains);
      });

    },


    saveDomain: function(user, model, callback) {
      //update model stuff into domains where id= model.id
      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("UPDATE domains SET domain = ?, nameservers = ? WHERE user_id = ? AND id = ?", [model.domain, model.nameservers, user.id, model.id],
            function(err, docs) {
              if (err) {
                callback(err);
              } else {
                callback(false, docs);
              }
              connection.release();
            });
        }
      });

    },

    deleteDomain: function(user, domain_id, callback) {
      var user_id = user.id;

      //update model stuff into domains where id= model.id
      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("DELETE FROM domains WHERE user_id = ? AND id = ?", [user_id, domain_id],
            function(err, docs) {
              if (err) {
                callback({
                  code: "Error deleting domain from db."
                });
              } else {
                callback(false, docs);
              }
              connection.release();
            });
        }
      });

    },

    deleteSharedDomain: function(aws_root_bucket, domain_id, callback) {

      //update model stuff into domains where id= model.id
      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("DELETE FROM domains WHERE aws_root_bucket = ? AND id = ?", [aws_root_bucket, domain_id],
            function(err, docs) {
              if (err) {
                callback({
                  code: "Error deleting domain from db."
                });
              } else {
                callback(false, docs);
              }
              connection.release();
            });
        }
      });

    },

    checkIfSubdomain: function(rootBucket, subdomain, callback) {

      //get all domains for user and check if they are in the subdomain
      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("SELECT * from domains WHERE aws_root_bucket = ?", [rootBucket],
            function(err, docs) {
              if (err) {
                console.log(err);
                callback({
                  code: "ErrorGettingDomainsFromDb"
                });
              } else {
                var domainFoundForSubdomain = false;
                var domainData = {};
                for (var i = 0; i < docs.length; i++) {
                  //if domain is in subdomain
                  if (subdomain.indexOf(docs[i].domain) > -1) {
                    domainData = docs[i];
                    domainData.isSubdomain = true;
                    domainFoundForSubdomain = true;
                    callback(false, docs[i]);
                    break;
                  }
                }
                if (!domainFoundForSubdomain) {
                  domainData.isSubdomain = false;
                  callback(false, domainData);
                }
              }
              connection.release();
            });
        }
      });
    }
  });

  return module;

};
