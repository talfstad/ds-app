module.exports = function(app, db) {

  var baseDeployedLander = require('./base_classes/base_deployed_lander')(app, db);
  var baseActiveGroup = require('./base_classes/base_active_group')(app, db);

  var module = {

    getAllLandersDeployedOnSharedDomain: function(aws_root_bucket, domain_id, callback) {

      var getTheLanders = function(callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("SELECT a.* FROM landers a JOIN deployed_landers b ON a.id = b.lander_id JOIN domains c ON b.domain_id = c.id WHERE b.domain_id = ? AND c.aws_root_bucket = ?", [domain_id, aws_root_bucket],
              function(err, dbLanders) {
                if (err) {
                  callback(err);
                } else {
                  callback(false, dbLanders);
                }
              });
          }
          connection.release();
        });
      };

      getTheLanders(function(err, dbLanders) {
        if (err) {
          callback(err);
        } else {
          callback(false, dbLanders);
        }
      });
    },

    isDuplicateDeleteDomainJob: function(domain_id, callback) {

      var duplicateJobTest = function(callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {

            connection.query("SELECT * FROM jobs WHERE domain_id = ? AND processing = ? AND action = ?", [domain_id, true, "deleteDomain"],
              function(err, dbDuplicates) {
                if (err) {
                  callback(err);
                } else {
                  callback(false, dbDuplicates);
                }
              });
          }
          connection.release();
        });
      };

      duplicateJobTest(function(err, dbDuplicates) {
        if (err) {
          callback(err);
        } else {
          if (dbDuplicates.length > 0) {
            callback(false, true);
          } else {
            callback(false, false);
          }
        }
      });
    },

    getAllLandersDeployedOnDomain: function(user, domain_id, callback) {
      var user_id = user.id;

      var getTheLanders = function(callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("SELECT * FROM landers a JOIN deployed_landers b ON a.id = b.lander_id WHERE b.lander_id = a.id AND b.domain_id = ? AND a.user_id = ?", [domain_id, user_id],
              function(err, dbLanders) {
                if (err) {
                  callback(err);
                } else {
                  callback(false, dbLanders);
                }
              });
          }
          connection.release();
        });
      };

      getTheLanders(function(err, dbLanders) {
        if (err) {
          callback(err);
        } else {
          callback(false, dbLanders);
        }
      });
    },

    deleteFromGroupsWithSharedDomains: function(domain_id, callback) {

      var removeDomainFromGroups = function(callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("DELETE FROM groups_with_domains WHERE domain_id = ?", [domain_id],
              function(err, docs) {
                if (err) {
                  callback(err);
                } else {
                  callback(false);
                }
              });
          }
          connection.release();
        });
      };

      removeDomainFromGroups(function(err) {
        if (err) {
          callback(err);
        } else {
          callback(false);
        }
      });
    },

    deleteFromGroupsWithDomains: function(user, domain_id, callback) {
      var user_id = user.id;

      var removeDomainFromGroups = function(callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("DELETE FROM groups_with_domains WHERE domain_id = ? AND user_id = ?", [domain_id, user_id],
              function(err, docs) {
                if (err) {
                  callback(err);
                } else {
                  callback(false);
                }
              });
          }
          connection.release();
        });
      };

      removeDomainFromGroups(function(err) {
        if (err) {
          callback(err);
        } else {
          callback(false);
        }
      });
    },

    //remove domain from all groups that have it
    removeActiveGroupsForDomain: function(user, domain_id, callback) {
      var user_id = user.id;

      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("DELETE FROM groups_with_domains WHERE user_id = ? AND domain_id = ?", [user_id, domain_id],
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

    //remove all deployed_landers on that domain
    removeDeployedLandersFromDomain: function(user, domain_id, callback) {
      var user_id = user.id;

      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("DELETE FROM deployed_landers WHERE user_id = ? AND domain_id = ?", [user_id, domain_id],
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

    addNewDomain: function(user, newDomainAttributes, callback) {

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
          callback(err);
        } else {
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
        }
      });
    },

    //gets all for one domain
    getDomain: function(user, domain_id, callback) {
      var user_id = user.id;

      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("SELECT * FROM domains WHERE user_id = ? AND id = ?", [user_id, domain_id],
            function(err, dbDomainInfo) {
              if (err) {
                callback(err);
              } else {
                callback(false, dbDomainInfo[0]);
              }
              connection.release();
            });
        }
      });
    },

    getSharedDomainInfo: function(domain_id, aws_root_bucket, callback) {
      app.log("domain_id: " + domain_id + " aws_root_bucket: " + aws_root_bucket, "debug");

      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("SELECT * FROM domains WHERE id = ? AND aws_root_bucket = ?", [domain_id, aws_root_bucket],
            function(err, dbDomainInfo) {
              if (err) {
                callback(err);
              } else {
                callback(false, dbDomainInfo[0]);
              }
              connection.release();
            });
        }
      });
    },

    getAll: function(user, rootBucket, successCallback) {
      var user_id = user.id;

      var getActiveGroupsForDomain = function(domain, callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {

            connection.query("SELECT a.id AS group_id, b.id, a.name,b.domain_id from groups a JOIN groups_with_domains b ON a.id=b.group_id WHERE (a.user_id = ? AND domain_id = ?)", [user_id, domain.id],
              function(err, dbActiveGroups) {

                if (dbActiveGroups.length <= 0) {
                  callback(false, []);
                } else {
                  var idx = 0;

                  for (var i = 0; i < dbActiveGroups.length; i++) {
                    baseActiveGroup.getExtraNestedForActiveGroup(user, dbActiveGroups[i], function(err) {
                      if (err) {
                        callback(err);
                      } else {
                        if (++idx == dbActiveGroups.length) {
                          callback(false, dbActiveGroups);
                        }
                      }

                    });
                  }
                }
                connection.release();
              });
          }
        });
      };

      var getActiveJobsForDomain = function(domain, callback) {
        //get all jobs attached to domain and make sure only select those. list is:
        // 1. deleteDomain
        var aws_root_bucket = domain.aws_root_bucket;

        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("SELECT a.id,a.action,a.processing,a.deploy_status,a.lander_id,a.domain_id,a.group_id,a.done,a.error,a.created_on FROM jobs a JOIN domains b ON a.domain_id = b.id WHERE a.action = ? AND b.aws_root_bucket = ? AND a.domain_id = ? AND a.processing = ? AND (a.done IS NULL OR a.done = ?)", ["deleteDomain", aws_root_bucket, domain.id, true, false],
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
                    baseDeployedLander.getExtraNestedForDeployedLander(user, dbDeployedLanders[i], domain, function() {
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

            getActiveGroupsForDomain(domain, function(err, activeGroups) {
              if (err) {
                callback(err);
              } else {
                domain.activeGroups = activeGroups;

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
            callback(err);
          } else {
            connection.query("SELECT id,domain,nameservers,aws_root_bucket,DATE_FORMAT(created_on, '%b %e, %Y %l:%i:%s %p') AS created_on FROM domains WHERE aws_root_bucket = ?", [rootBucket], function(err, dbdomains) {
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
          }
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
  };

  return module;

};
