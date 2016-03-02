module.exports = function(db) {

  var utils = require('../utils/utils.js')();
  var dbLanders = require('./landers.js')(db);

  return {

    removeFromLandersWithCampaigns: function(user, id, successCallback) {
      var user_id = user.id;
      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("DELETE FROM landers_with_campaigns WHERE user_id = ? AND id = ?", [user_id, id],
            function(err, dbSuccessDelete) {

              successCallback(dbSuccessDelete);

              //release connection
              connection.release();
            });
        }
      });

    },

    removeFromCampaignsWithDomains: function(user, id, successCallback) {
      var user_id = user.id;
      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("DELETE FROM campaigns_with_domains WHERE user_id = ? AND id = ?", [user_id, id],
            function(err, dbSuccessDelete) {

              successCallback(dbSuccessDelete);

              //release connection
              connection.release();
            });
        }
      });

    },

    addActiveCampaignToDomain: function(user, modelAttributes, callback) {
      var user_id = user.id;
      
      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("CALL add_domain_to_campaign(?, ?, ?)", [modelAttributes.domain_id, modelAttributes.campaign_id, user_id], function(err, docs) {
            if (err) {
              console.log(err);
              callback("Error adding active campaign");
            } else {
              modelAttributes.active_campaign_id = docs[0][0]["LAST_INSERT_ID()"];

              var currentLanders = docs[1];

              //get current lander data by id
              dbLanders.getAll(user, function(currentLandersArr) {
                //add the current lander data and return!
                modelAttributes.currentLanders = currentLandersArr

                modelAttributes.id = modelAttributes.campaign_id;
                callback(modelAttributes);

              }, currentLanders);

            }

            //release connection
            connection.release();
          });
        }
      });
    },

    addActiveCampaign: function(user, modelAttributes, callback) {
      var user_id = user.id;

      // args: lander_id, campaign_id, user_id

      // [
      //   [{
      //     "LAST_INSERT_ID()": 48
      //   }],
      //   [{
      //     "domain_id": 1,
      //     "domain": "hardbodiesandboners.org"
      //   }, {
      //     "domain_id": 2,
      //     "domain": "weightlosskey.com"
      //   }, {
      //     "domain_id": 3,
      //     "domain": "notdeployed.com"
      //   }], {
      //     "fieldCount": 0,
      //     "affectedRows": 0,
      //     "insertId": 0,
      //     "serverStatus": 34,
      //     "warningCount": 0,
      //     "message": "",
      //     "protocol41": true,
      //     "changedRows": 0
      //   }
      // ]

      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("CALL add_campaign_to_lander(?, ?, ?)", [modelAttributes.lander_id, modelAttributes.campaign_id, user_id], function(err, docs) {
            if (err) {
              console.log(err);
              callback("Error adding active campaign");
            } else {
              modelAttributes.active_campaign_id = docs[0][0]["LAST_INSERT_ID()"];
              modelAttributes.currentDomains = docs[1];
              modelAttributes.id = modelAttributes.campaign_id;
              callback(modelAttributes);
            }

            //release connection
            connection.release();
          });
        }
      });

    },

    getAll: function(user, successCallback) {

      var user_id = user.id;

      getAllDomainIdsForCampaign = function(campaign, callback) {

        db.getConnection(function(err, connection) {
          if (err) {
            console.log(err);
          }
          connection.query("SELECT domain_id FROM campaigns_with_domains WHERE user_id = ? AND campaign_id = ?", [user_id, campaign.id],
            function(err, dbDomainIdsForCampaign) {
              callback(dbDomainIdsForCampaign);

              //release connection
              connection.release();
            });
        });
      };

      var getAllCampaignsDb = function(callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            console.log(err);
          }
          connection.query("SELECT id,name FROM campaigns WHERE user_id = ?", [user_id],
            function(err, dbCampaigns) {
              if (dbCampaigns.length <= 0) {
                callback([]);
              } else {
                var idx = 0;
                for (var i = 0; i < dbCampaigns.length; i++) {
                  getAllDomainIdsForCampaign(dbCampaigns[i], function(campaignsDomainIds) {

                    var deployedCampaign = dbCampaigns[idx];
                    deployedCampaign.campaignsDomainIds = campaignsDomainIds;

                    if (++idx == dbCampaigns.length) {
                      callback(dbCampaigns);
                    }

                  });
                }
              }
              //release connection
              connection.release();
            });
        });
      };

      //call to get all and return rows
      getAllCampaignsDb(function(campaigns) {
        return successCallback(campaigns);
      });

    }

  }

};
