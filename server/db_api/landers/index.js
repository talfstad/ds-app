module.exports = function(app, db) {

  var dbAws = require("../aws")(app, db);

  var baseActiveCampaign = require('../base_classes/base_active_campaign')(app, db);

  var module = _.extend(baseActiveCampaign, {

    common: require("./common")(app, db), //needs to be like this to access in other classes


    getAllDomainsLanderIsDeployedOn: function(user, lander_id, callback) {
      var user_id = user.id;

      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("SELECT a.domain, b.domain_id, a.cloudfront_id FROM domains a JOIN deployed_landers b ON a.id=b.domain_id WHERE b.user_id = ? AND b.lander_id = ?", [user_id, lander_id],
            function(err, dbDomains) {
              if (err) {
                callback(err);
              } else {
                callback(false, dbDomains);
              }
              connection.release();
            });
        }
      });
    },

    getDeployedLandersByLanderId: function(user, lander_id, callback) {
      var user_id = user.id;

      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("SELECT id, lander_id, domain_id FROM deployed_landers WHERE user_id = ? AND lander_id = ?", [user_id, lander_id],
            function(err, dbDeployedLanders) {
              if (err) {
                callback(err);
              } else {
                callback(false, dbDeployedLanders);
              }
              connection.release();
            });
        }
      });
    },

    deleteFromLandersWithCampaigns: function(user, lander_id, callback) {
      var user_id = user.id;

      var removeLanderFromCampaigns = function(callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("DELETE FROM landers_with_campaigns WHERE lander_id = ? AND user_id = ?", [lander_id, user_id],
              function(err, docs) {
                if (err) {
                  callback(err);
                } else {
                  callback(false);
                }
                connection.release();
              });
          }
        });
      };

      removeLanderFromCampaigns(function(err) {
        if (err) {
          callback(err);
        } else {
          callback(false);
        }
      });

    },

    getUrlEndpointsForLander: function(user, lander_id, callback) {
      var user_id = user.id;
      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("SELECT id,filename,optimized_pagespeed,original_pagespeed FROM url_endpoints WHERE lander_id = ? AND user_id = ?", [lander_id, user_id],
            function(err, dbUrlEndpoints) {
              if (err) {
                callback(err);
              } else {
                callback(false, dbUrlEndpoints);
              }
              connection.release();
            });
        }
      });
    },

    getPagespeedScoresForLander: function(user, lander_id, callback) {
      //return an array of objects like this:
      // {id: "", filename:"",optimized_pagespeed:"",original_pagespeed:""}

      module.getUrlEndpointsForLander(user, lander_id, function(err, dbUrlEndpoints) {
        if (err) {
          callback(err);
        } else {
          callback(false, dbUrlEndpoints);
        }
      });
    },

    addS3FolderDeploymentFolderToLander: function(user, lander_id, s3_folder_name, callback) {
      var user_id = user.id;

      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("UPDATE landers SET deployment_folder_name = ?, s3_folder_name = ? WHERE user_id = ? AND id = ?", [s3_folder_name, s3_folder_name, user_id, lander_id],
            function(err, docs) {
              if (err) {
                callback(err);
              } else {
                callback(false);
              }
              connection.release();
            });
        }
      });
    },

    //save optimzations and modified
    updateAllLanderData: function(user, attr, callback) {
      var user_id = user.id;

      if (!attr.id) {
        //multiple landers
        var multipleLanders = attr.multipleLanders;

        //update multiple landers modified = 0
        var updateLanderToNotModified = function(lander_id, callback) {
          db.getConnection(function(err, connection) {
            if (err) {
              callback(err);
            } else {
              connection.query("UPDATE landers SET modified = ? WHERE id = ? AND user_id = ?", [false, lander_id, user_id],
                function(err, user_ids) {
                  if (err) {
                    callback(err);
                  } else {
                    callback(false, user_ids);
                  }
                  connection.release();
                });
            }
          })
        };

        var asyncIndex = 0;
        if (multipleLanders.length > 0) {
          for (var i = 0; i < multipleLanders.length; i++) {
            updateLanderToNotModified(multipleLanders[i], function(err) {
              if (err) {
                callback(err);
              } else {
                if (++asyncIndex == multipleLanders.length) {
                  callback(false);
                }
              }
            });
          }
        } else {
          callback(false);
        }

      } else {
        //normal landerData 

        var lander_id = attr.id;
        var deploy_root = attr.deploy_root;
        var deployment_folder_name = attr.deployment_folder_name;

        //try saveModified first.
        var modified = attr.saveModified;
        if (!attr.modified) {
          modified = attr.modified;
        }

        //validate inputs
        if (deployment_folder_name) {
          if (!deployment_folder_name.match(/^[a-z0-9\-]+$/i)) {
            callback({ code: "InvalidDeploymentFolderInput" });
            return;
          }

          var checkIfDeploymentFolderExists = function(currentDeploymentFolder, callback) {

            if (deployment_folder_name == currentDeploymentFolder) {
              callback(false);
              return;
            }

            var getAllUserIdsOnThisBucket = function(baseBucketName, callback) {
              db.getConnection(function(err, connection) {
                if (err) {
                  callback(err);
                } else {
                  connection.query("SELECT user_id FROM user_settings WHERE aws_root_bucket = ?", [baseBucketName],
                    function(err, user_ids) {
                      if (err) {
                        callback(err);
                      } else {
                        callback(false, user_ids);
                      }
                      connection.release();
                    });
                }
              })
            };

            var doesDeploymentFolderExistForUser = function(user_id, deployment_folder_name, callback) {
              db.getConnection(function(err, connection) {
                if (err) {
                  callback(err);
                } else {
                  connection.query("SELECT user_id FROM landers WHERE deployment_folder_name = ? AND user_id = ?", [deployment_folder_name, user_id],
                    function(err, docs) {
                      if (err) {
                        callback(err);
                      } else {
                        if (docs.length <= 0) {
                          callback(false, false);
                        } else {
                          callback(false, true);
                        }
                      }
                      connection.release();
                    });
                }
              })
            };

            //1. get all user ids that have the same root bucket
            dbAws.keys.getAmazonApiKeysAndRootBucket(user, function(err, awsData) {
              if (err) {
                callback(err);
              } else {
                var baseBucketName = awsData.aws_root_bucket;

                getAllUserIdsOnThisBucket(baseBucketName, function(err, user_ids) {
                  var asyncIndex = 0;
                  for (var i = 0; i < user_ids.length; i++) {
                    var tmpUserId = user_ids[i].user_id;

                    doesDeploymentFolderExistForUser(tmpUserId, deployment_folder_name, function(err, exists) {
                      if (err) {
                        callback(err);
                      } else {
                        if (exists) {
                          callback({ error: { code: "DeploymentFolderExists" } });
                          return;
                        }

                        if (++asyncIndex == user_ids.length) {
                          callback(false);
                        }
                      }
                    })
                  }
                  if (user_ids.length <= 0) {
                    callback(false);
                  }
                });
              }
            });
          };
        }

        var updateOldDeploymentFolderName = function(callback) {
          if (!deployment_folder_name) {
            callback();
          } else {
            db.getConnection(function(err, connection) {
              if (err) {
                callback(err);
              } else {
                //set the deployment_folder_name to the old_deployment_folder_name
                connection.query("SELECT deployment_folder_name FROM landers WHERE user_id = ? AND id = ?", [user_id, lander_id],
                  function(err, deployment_folder_name_docs) {
                    if (err) {
                      callback(err);
                    } else {
                      var currentDeploymentFolder = deployment_folder_name_docs[0].deployment_folder_name;
                      checkIfDeploymentFolderExists(currentDeploymentFolder, function(err) {
                        if (err) {
                          callback(err);
                        } else {
                          connection.query("UPDATE landers SET old_deployment_folder_name = ? WHERE user_id = ? AND id = ?", [currentDeploymentFolder, user_id, lander_id],
                            function(err, docs) {
                              if (err) {
                                callback(err);
                              } else {
                                callback(false);
                              }
                              connection.release();
                            });
                        }
                      });
                    }
                  });
              }
            });
          }
        };

        //values for query

        updateOldDeploymentFolderName(function(err) {
          if (err) {
            callback(err);
          } else {
            var attrArr = [modified, deploy_root, deployment_folder_name, user_id, lander_id];

            db.getConnection(function(err, connection) {
              if (err) {
                console.log(err);
              } else {
                connection.query("UPDATE landers SET modified = ?, deploy_root = ?, deployment_folder_name = ? WHERE user_id = ? AND id = ?", attrArr,
                  function(err, docs) {
                    if (err) {
                      callback(err);
                    } else {
                      callback(false, {
                        id: attr.id
                      });
                    }
                    connection.release();
                  });
              }
            });
          }

        });

      }



    },

    updateLanderModifiedData: function(user, attr, callback) {

      var user_id = user.id;
      var lander_id = attr.id;
      var modified = attr.modified;

      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("UPDATE landers SET modified = ? WHERE user_id = ? AND id = ?", [modified, user_id, lander_id],
            function(err, docs) {
              if (err) {
                callback(err);
              } else {
                callback(false, {
                  id: attr.id
                });
              }
              connection.release();
            });
        }
      });
    },

    deleteLander: function(user, lander_id, callback) {
      var user_id = user.id;
      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("DELETE FROM landers WHERE user_id = ? AND id = ?", [user_id, lander_id], function(err, docs) {
            if (err) {
              callback(err);
            } else {
              callback(false);
            }
            connection.release();
          });
        }
      });

    },

    addNewDuplicateLander: function(user, duplicateLanderAttributes, successCallback) {

      var user_id = user.id;
      var lander_name = duplicateLanderAttributes.name;

      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("CALL save_new_duplicate_lander(?, ?)", [lander_name, user_id],
            function(err, docs) {
              if (err) {
                console.log(err);
              } else {
                //success

                //TODO copy all lander resources as well on duplicate lander (urlEndpoints, files, etc)


                duplicateLanderAttributes.id = docs[0][0]["LAST_INSERT_ID()"];
                duplicateLanderAttributes.created_on = docs[1][0].created_on;
                //remove any attributes we dont want to overwrite
                delete duplicateLanderAttributes.deployedDomains;
                delete duplicateLanderAttributes.activeJobs;
                delete duplicateLanderAttributes.activeCampaigns;
                delete duplicateLanderAttributes.urlEndpoints;

                successCallback(duplicateLanderAttributes);
              }
              connection.release();
            });
        }
      });
    },

    saveNewLander: function(user, landerData, callback) {

      var lander_name = landerData.name;
      var lander_url = landerData.lander_url;
      var s3_folder_name = landerData.s3_folder_name;

      var urlEndpoints = landerData.urlEndpoints;
      if (!urlEndpoints) urlEndpoints = [];

      var user_id = user.id;
      //param order: working_node_id, action, processing, lander_id, domain_id, campaign_id, user_id
      db.getConnection(function(err, connection) {
        if (err) {
          callback(err)
        } else {
          connection.query("CALL save_new_lander(?, ?, ?, ?)", [lander_name, lander_url, s3_folder_name, user_id],
            function(err, docs) {
              if (err) {
                callback(err);
              } else {
                //TODO loop url endpoints and save them here
                //for each endpoint call insert into urlEndpoints here and do a idx counter to determine when to callback
                landerData.id = docs[0][0]["LAST_INSERT_ID()"];

                landerData.created_on = docs[1][0].created_on;

                if (urlEndpoints.length > 0) {
                  var endpointsIdx = 0;
                  for (var i = 0; i < urlEndpoints.length; i++) {
                    var filename = urlEndpoints[i].filename;

                    connection.query("INSERT INTO url_endpoints(filename, user_id, lander_id) VALUES (?, ?, ?)", [filename, user_id, landerData.id],
                      function(err, endpointDocs) {
                        if (err) {
                          callback(err);
                        } else {
                          endpointsIdx++;

                          if (endpointsIdx == urlEndpoints.length) {
                            callback(false);
                          }
                        }
                        connection.release();
                      });
                  }
                } else {
                  callback(false);
                }
              }
            });
        }
      });
    },

    addLanderToDeployedLanders: function(user, landerData, callback) {
      var user_id = user.id;
      var lander_id = landerData.lander_id;
      var domain_id = landerData.domain_id;

      //insert into deployed_landers

      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("CALL add_deployed_lander(?, ?, ?);", [user_id, lander_id, domain_id], function(err, docs) {
            if (err) {
              console.log(err);
              callback(err);
            } else {
              landerData.id = docs[0][0]["LAST_INSERT_ID()"];
              // return the ID
              callback(false, landerData);
            }
            connection.release();
          });
        }
      });
    },

    getDeployedDomainsForLander: function(user, lander_id, callback) {
      var user_id = user.id;

      var getActiveJobsForDeployedDomain = function(deployedDomain, callback) {
        //get all jobs attached to lander and make sure only select those. list is:
        // 1. deployLanderToDomain
        // 2. undeployLanderFromDomain
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            var arr = ["undeployLanderFromDomain", "deployLanderToDomain", user_id, deployedDomain.lander_id, deployedDomain.domain_id, true];
            connection.query("SELECT id,action,deploy_status,lander_id,domain_id,campaign_id,processing,done,error,created_on FROM jobs WHERE ((action = ? OR action = ?) AND user_id = ? AND lander_id = ? AND domain_id = ? AND processing = ?)", arr,
              function(err, dbActiveJobs) {
                callback(false, deployedDomain, dbActiveJobs);
                connection.release();
              });
          }
        });
      };

      var getLoadTimesForDeployedDomain = function(deployedDomain, callback) {
        var deployed_lander_id = deployedDomain.id;


        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("SELECT id,url_endpoint_id,load_time FROM endpoint_load_times WHERE deployed_lander_id = ? AND user_id = ?", [deployed_lander_id, user_id],
              function(err, dbLoadTimes) {
                callback(false, dbLoadTimes);
                connection.release();
              });
          }
        });
      };

      var getDeployedDomainsForLander = function(callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            console.log(err);
          } else {
            connection.query("SELECT a.id AS domain_id,a.domain,b.id,b.lander_id from domains a JOIN deployed_landers b ON a.id=b.domain_id WHERE (b.user_id = ? AND lander_id = ?)", [user_id, lander_id],
              function(err, dbDeployedDomains) {
                if (err) {
                  callback(err)
                } else {
                  if (dbDeployedDomains.length <= 0) {
                    callback(false, []);
                  } else {
                    var idx = 0;
                    for (var i = 0; i < dbDeployedDomains.length; i++) {
                      getActiveJobsForDeployedDomain(dbDeployedDomains[i], function(err, deployedDomain, activeJobs) {
                        if (err) {
                          callback(err);
                        } else {
                          deployedDomain.activeJobs = activeJobs;
                          getLoadTimesForDeployedDomain(deployedDomain, function(err, loadTimes) {
                            deployedDomain.endpoint_load_times = loadTimes;
                            if (++idx == dbDeployedDomains.length) {
                              callback(false, dbDeployedDomains);
                            }
                          });
                        }
                      });
                    }
                  }
                }
                connection.release();
              });
          }
        });
      };

      getDeployedDomainsForLander(callback);
    },


    getAll: function(user, successCallback, landersToGetArr) {

      var user_id = user.id;

      var getActiveCampaignsForLander = function(lander, callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            console.log(err);
          }
          connection.query("SELECT a.id AS campaign_id, b.id, a.name,b.lander_id from campaigns a JOIN landers_with_campaigns b ON a.id=b.campaign_id WHERE (a.user_id = ? AND lander_id = ?)", [user_id, lander.id],
            function(err, dbActiveCampaigns) {

              if (dbActiveCampaigns.length <= 0) {
                callback(false, []);
              } else {
                var idx = 0;
                for (var i = 0; i < dbActiveCampaigns.length; i++) {
                  module.getExtraNestedForActiveCampaign(user, dbActiveCampaigns[i], function(err) {
                    if (err) {
                      callback(err);
                    } else {
                      if (++idx == dbActiveCampaigns.length) {
                        callback(false, dbActiveCampaigns);
                      }
                    }

                  });
                }
              }
              connection.release();
            });
        });
      };



      var getActiveSnippetsForUrlEndpoint = function(urlEndpoint, callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("SELECT a.id, b.name, a.snippet_id FROM active_snippets a JOIN snippets b ON a.snippet_id=b.id WHERE (a.user_id = ? AND a.url_endpoint_id = ?)", [user_id, urlEndpoint.id],
              function(err, dbActiveSnippets) {
                callback(false, dbActiveSnippets);
                connection.release();
              });
          }
        });
      };

      var getEndpointsForLander = function(lander, callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            console.log(err);
          } else {
            connection.query("SELECT id,filename,lander_id,optimization_errors, original_pagespeed,optimized_pagespeed from url_endpoints WHERE (user_id = ? AND lander_id = ?)", [user_id, lander.id],
              function(err, dbUrlEndpoints) {
                if (err) {
                  callback(err);
                } else {

                  if (dbUrlEndpoints.length <= 0) {
                    callback(false, []);
                  } else {
                    var idx = 0;
                    for (var i = 0; i < dbUrlEndpoints.length; i++) {
                      //parse the optimization errors because they were stringified in the db
                      dbUrlEndpoints[i].optimization_errors = JSON.parse(dbUrlEndpoints[i].optimization_errors);
                      getActiveSnippetsForUrlEndpoint(dbUrlEndpoints[i], function(err, activeSnippets) {
                        if (err) {
                          callback(err);
                        } else {
                          var endpoint = dbUrlEndpoints[idx];
                          endpoint.activeSnippets = activeSnippets;
                          if (++idx == dbUrlEndpoints.length) {
                            callback(false, dbUrlEndpoints);
                          }
                        }
                      });
                    }
                  }
                }
                connection.release();
              });
          }
        });
      };

      var getActiveJobsForLander = function(lander, callback) {
        //get all jobs attached to lander and make sure only select those. list is:
        // 1. addNewLander
        // 2. deleteLander
        db.getConnection(function(err, connection) {
          if (err) {
            console.log(err);
          } else {

            connection.query("SELECT id,action,lander_id,deploy_status,domain_id,campaign_id,processing,done,error,created_on FROM jobs WHERE ((action = ? OR action = ? OR action = ? OR action = ?) AND user_id = ? AND lander_id = ? AND processing = ?)", ["addLander", "deleteLander", "ripLander", "savingLander", user_id, lander.id, true],
              function(err, dbActiveJobs) {
                if (err) {
                  callback(err);
                } else {
                  callback(false, dbActiveJobs);
                }
                connection.release();
              });
          }
        });
      };


      var getExtraNestedForLander = function(lander, callback) {
        getEndpointsForLander(lander, function(err, endpoints) {

          lander.urlEndpoints = endpoints;

          module.getDeployedDomainsForLander(user, lander.id, function(err, deployedDomains) {
            if (err) {
              callback(err);
            } else {
              lander.deployedDomains = deployedDomains;

              getActiveCampaignsForLander(lander, function(err, activeCampaigns) {
                if (err) {
                  callback(err);
                } else {

                  lander.activeCampaigns = activeCampaigns;

                  getActiveJobsForLander(lander, function(err, activeJobsForLander) {
                    if (err) {
                      callback(err)
                    } else {
                      lander.activeJobs = activeJobsForLander;
                      callback(false);
                    }
                  });
                }
              });
            }

          });

        });
      };

      var getAllLandersDb = function(callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("SELECT id,name,modified,s3_folder_name,deploy_root,deployment_folder_name,old_deployment_folder_name,DATE_FORMAT(created_on, '%b %e, %Y %l:%i:%s %p') AS created_on FROM landers WHERE user_id = ?", [user_id], function(err, dblanders) {
              if (err) {
                callback(err);
              } else {
                var idx = 0;
                for (var i = 0; i < dblanders.length; i++) {
                  getExtraNestedForLander(dblanders[i], function() {

                    if (++idx == dblanders.length) {
                      callback(false, dblanders);
                    }

                  });
                }
                if (dblanders.length <= 0) {
                  callback(false, dblanders);
                }
              }
              connection.release();
            });
          }
        });
      };

      var getLandersById = function(landersToGetArr, callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {

            var queryIds = "AND";
            for (var i = 0; i < landersToGetArr.length; i++) {
              queryIds += " id = " + landersToGetArr[i].lander_id
              if (i + 1 < landersToGetArr.length) {
                queryIds += " OR";
              }
            }

            var queryString = "SELECT id,name,modified,s3_folder_name,deploy_root,deployment_folder_name,old_deployment_folder_name,DATE_FORMAT(created_on, '%b %e, %Y %l:%i:%s %p') AS created_on FROM landers WHERE user_id = ? " + queryIds;

            connection.query(queryString, [user_id], function(err, dblanders) {
              if (err) {
                console.log("1: " + err);
                callback(err);
              } else {
                var idx = 0;
                for (var i = 0; i < dblanders.length; i++) {
                  getExtraNestedForLander(dblanders[i], function() {

                    if (++idx == dblanders.length) {
                      callback(false, dblanders);
                    }

                  });
                }
                if (dblanders.length <= 0) {
                  callback(false, dblanders);
                }
              }
              connection.release();
            });
          }
        });
      };

      //if landersToGetArr is here then just get those landers. arr of objects with id as key
      if (landersToGetArr) {
        getLandersById(landersToGetArr, function(err, landers) {
          if (err) {
            return successCallback(err);
          } else {
            return successCallback(false, landers);
          }
        });
      } else {
        //call to get all and return rows
        getAllLandersDb(function(err, landers) {
          if (err) {
            return successCallback(err);
          } else {
            return successCallback(false, landers);
          }
        });
      }

    }
  });

  return module;

};
