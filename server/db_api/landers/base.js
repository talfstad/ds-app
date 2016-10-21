module.exports = function(app, db) {

  var baseActiveGroup = require('../base_shared_classes/base_active_group')(app, db);

  var find = require('find');
  var fs = require('fs');
  var cmd = require('node-cmd');

  var module = _.extend({

    addUpdateEndpoint: function(user, endpoint, callback) {
      var user_id = user.id;
      
      var lander_id = endpoint.lander_id;
      var filePath = endpoint.filePath;
      var originalPagespeed = endpoint.original_pagespeed;
      var optimizedPagespeed = endpoint.optimized_pagespeed;
      var optimizationErrorsString = JSON.stringify(endpoint.optimization_errors);
      var isUpdate = endpoint.isUpdate;

      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          var query = "CALL add_url_endpoint(?, ?, ?, ?, ?, ?);";
          var queryArr = [user_id, lander_id, originalPagespeed, optimizedPagespeed, filePath, optimizationErrorsString];

          if (isUpdate) {
            query = "UPDATE url_endpoints SET original_pagespeed = ?, optimized_pagespeed = ?, optimization_errors = ? WHERE lander_id = ?";
            queryArr = [originalPagespeed, optimizedPagespeed, optimizationErrorsString, lander_id];
          }

          connection.query(query, queryArr, function(err, docs) {
            if (err) {
              callback(err);
            } else {
              //TODO: validate credentials by creating archive bucket with name user.uid
              if (!isUpdate) {
                endpoint.id = docs[0][0]["LAST_INSERT_ID()"];
              }

              callback(false, endpoint);
            }
            connection.release();
          });
        }
      });
    },

    unGzipAllFilesInStaging: function(staging_path, callback) {

      var unGzipFile = function(file, callback) {
        var ext = file.split('.').pop();

        if (app.config.noGzipArr.indexOf(ext) <= -1) {
          //first rename it
          var gzippedFile = file + ".gz";
          fs.rename(file, gzippedFile, function(err) {
            //-N restore original name, -f force overwrite, decompress, -S use suffix
            //gzip -N -d -f -S .html index.html
            cmd.get("nice gzip -c -d " + gzippedFile + " > " + file, function(data) {
              //delete the gzipped version
              fs.unlink(gzippedFile, function() {
                callback(false);
              });
            });
          });
        } else {
          callback(false);
        }
      }

      //2. UNGZIP!
      find.file(staging_path, function(files) {
        var asyncIndex = 0;
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          unGzipFile(file, function() {
            if (++asyncIndex == files.length) {
              callback(false);
            }
          })
        }
      });
    },

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

    getLanderNotes: function(user, lander_id, callback) {
      var user_id = user.id;

      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("SELECT notes FROM landers WHERE user_id = ? AND id = ?", [user_id, lander_id],
            function(err, dbLanderNotes) {
              if (err) {
                callback(err);
              } else {
                callback(false, dbLanderNotes[0].notes);
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

    deleteFromLandersWithGroups: function(user, lander_id, callback) {
      var user_id = user.id;

      var removeLanderFromGroups = function(callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("DELETE FROM landers_with_groups WHERE lander_id = ? AND user_id = ?", [lander_id, user_id],
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

      removeLanderFromGroups(function(err) {
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

    updateNotes: function(user, attr, callback) {
      var user_id = user.id;
      var notes = attr.notes;
      var lander_id = attr.id;
      var notes_search = attr.notes_search;

      //update multiple landers modified = 0
      var updateNotesDb = function() {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("UPDATE landers SET notes = ?, notes_search = ? WHERE id = ? AND user_id = ?", [notes, notes_search, lander_id, user_id],
              function(err, user_ids) {
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
      updateNotesDb();
    },

    updateName: function(user, attr, callback) {
      var user_id = user.id;
      var lander_id = attr.id;
      var name = attr.name;

      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
        } else {
          connection.query("UPDATE landers SET name = ? WHERE user_id = ? AND id = ?", [name, user_id, lander_id],
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

    updateLanderModifiedData: function(user, attr, callback) {

      var user_id = user.id;
      var lander_id = attr.id;
      var modified = attr.modified;

      db.getConnection(function(err, connection) {
        if (err) {
          callback(err);
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
          callback(err);
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

    saveNewLander: function(user, landerData, callback) {

      var lander_name = landerData.name;
      var lander_url = landerData.lander_url;
      var s3_folder_name = landerData.s3_folder_name;
      var notes = "";
      var notes_search = "";
      if (lander_url) {
        notes = '<p>This lander was ripped from: <a href="' + lander_url + '">' + lander_url + '</a>&nbsp;</p><p><br></p>';
        notes_search = 'This lander was ripped from: ' + lander_url;
      }
      var notes

      var urlEndpoints = landerData.urlEndpoints;
      if (!urlEndpoints) urlEndpoints = [];

      var user_id = user.id;
      //param order: working_node_id, action, processing, lander_id, domain_id, group_id, user_id
      db.getConnection(function(err, connection) {
        if (err) {
          callback(err)
        } else {
          connection.query("CALL save_new_lander_with_notes(?, ?, ?, ?, ?, ?)", [lander_name, lander_url, notes, notes_search, s3_folder_name, user_id],
            function(err, docs) {
              if (err) {
                console.log("error ! : " + JSON.stringify(err));
                callback(err);
              } else {
                //TODO loop url endpoints and save them here
                //for each endpoint call insert into urlEndpoints here and do a idx counter to determine when to callback
                landerData.id = docs[0][0]["LAST_INSERT_ID()"];
                landerData.notes = notes;
                landerData.notes_search = notes_search;
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
            connection.query("SELECT id,action,deploy_status,lander_id,domain_id,group_id,processing,done,error,created_on FROM jobs WHERE ((action = ? OR action = ?) AND user_id = ? AND lander_id = ? AND domain_id = ? AND processing = ?)", arr,
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
            callback(err);
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

      var getActiveGroupsForLander = function(lander, callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("SELECT a.id AS group_id, b.id, a.name,b.lander_id from groups a JOIN landers_with_groups b ON a.id=b.group_id WHERE (a.user_id = ? AND lander_id = ?)", [user_id, lander.id],
              function(err, dbActiveGroups) {

                if (dbActiveGroups.length <= 0) {
                  callback(false, []);
                } else {
                  var idx = 0;
                  for (var i = 0; i < dbActiveGroups.length; i++) {
                    module.getExtraNestedForActiveGroup(user, dbActiveGroups[i], function(err) {
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
            callback(err);
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
            callback(err);
          } else {

            connection.query("SELECT id,action,lander_id,deploy_status,domain_id,group_id,processing,done,error,created_on FROM jobs WHERE ((action = ? OR action = ? OR action = ? OR action = ?) AND user_id = ? AND lander_id = ? AND processing = ?)", ["addLander", "deleteLander", "ripLander", "savingLander", user_id, lander.id, true],
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

              getActiveGroupsForLander(lander, function(err, activeGroups) {
                if (err) {
                  callback(err);
                } else {

                  lander.activeGroups = activeGroups;

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
            connection.query("SELECT id,notes_search,name,modified,s3_folder_name,deploy_root,deployment_folder_name,old_deployment_folder_name,DATE_FORMAT(created_on, '%b %e, %Y %l:%i:%s %p') AS created_on FROM landers WHERE user_id = ?", [user_id], function(err, dblanders) {
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

            var queryString = "SELECT id,notes_search,name,modified,s3_folder_name,deploy_root,deployment_folder_name,old_deployment_folder_name,DATE_FORMAT(created_on, '%b %e, %Y %l:%i:%s %p') AS created_on FROM landers WHERE user_id = ? " + queryIds;

            connection.query(queryString, [user_id], function(err, dblanders) {
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
  }, baseActiveGroup);

  return module;

};
