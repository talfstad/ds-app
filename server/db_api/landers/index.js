module.exports = function(app, db, base) {

  var module = _.extend({

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
          });
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
        var lander_name = attr.name;

        //try saveModified first.
        var modified = attr.saveModified;
        //set it to false if no saveModified
        if (!attr.modified) {
          modified = attr.modified;
        }

        //validate inputs
        if (!deployment_folder_name) {
          callback({ code: "InvalidDeploymentFolderInput" });
          return;
        }
        if (!deployment_folder_name.match(/^[a-z0-9\-]+$/i)) {
          callback({ code: "InvalidDeploymentFolderInput" });
          return;
        }


        var checkIfDeploymentFolderExists = function(currentDeploymentFolder, callback) {

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
                connection.query("SELECT user_id,deployment_folder_name FROM landers WHERE deployment_folder_name = ? AND user_id = ?", [deployment_folder_name, user_id],
                  function(err, docs) {
                    if (err) {
                      callback(err);
                    } else {
                      //if deployment folder name is the same as what we passed in no error
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
          base.aws.keys.getAmazonApiKeysAndRootBucket(user, function(err, awsData) {
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
                  });
                }
                if (user_ids.length <= 0) {
                  callback(false);
                }
              });
            }
          });
        };


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
                      if (deployment_folder_name == currentDeploymentFolder) {
                        callback(false);
                      } else {
                        checkIfDeploymentFolderExists(currentDeploymentFolder, function(err) {
                          if (err) {
                            err.deployment_folder_name = currentDeploymentFolder;
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
            var attrArr = [lander_name, modified, deploy_root, deployment_folder_name, user_id, lander_id];

            db.getConnection(function(err, connection) {
              if (err) {
                callback(err);
              } else {
                connection.query("UPDATE landers SET name = ?, modified = ?, deploy_root = ?, deployment_folder_name = ? WHERE user_id = ? AND id = ?", attrArr,
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
    }
  }, base.landers);

  return module;

};
