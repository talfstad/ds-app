module.exports = function(db) {

  var utils = require('../utils/utils.js')();

  return {

    addActiveCampaign: function(user, modelAttributes, successCallback) {
      var user_id = user.id;

      // args: lander_id, campaign_id, user_id
      db.query("CALL add_campaign_to_lander(?, ?, ?)", [modelAttributes.lander_id, modelAttributes.campaign_id, user_id], function(err, docs) {
        if (err) {
          console.log(err);
          callback("Error adding active campaign");
        } else {
          console.log("TREV: " + JSON.stringify(docs));
          modelAttributes.currentDomains = docs[0];
          modelAttributes.id = modelAttributes.campaign_id;
          successCallback(modelAttributes);
        }
      });
    },

    getAll: function(user, successCallback) {

      var user_id = user.id;

      getAllDomainIdsForCampaign = function(campaign, callback) {
        db.query("SELECT domain_id FROM campaigns_with_domains WHERE user_id = ? AND campaign_id = ?", [user_id, campaign.id],
          function(err, dbDomainIdsForCampaign) {
            callback(dbDomainIdsForCampaign);
          });
      };

      var getAllCampaignsDb = function(callback) {
        db.query("SELECT id,name FROM campaigns WHERE user_id = ?", [user_id],
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
          });
      };

      //call to get all and return rows
      getAllCampaignsDb(function(campaigns) {
        return successCallback(campaigns);
      });



      ///////MOCK DATA FOR GET ALL LANDERS ////////////      
      // [{
      //   id: 1,
      //   name: "campaign name"
      // }]

    }


    // add: function(name, user, callback) {
    //   db.query("CALL insert_campaign(?, ?);", [name, user], function(err, docs) {
    //     if (err) {
    //       console.log(err);
    //       callback("Error adding campaign.");
    //     } else {
    //       callback();
    //     }
    //   });
    // },

    // delete: function(id, user, callback) {
    //   db.query("CALL delete_campaign(?, ?);", [id, user], function(err, docs) {
    //     if (err) {
    //       console.log(err);
    //       callback("Error deleting campaign with id: " + id);
    //     } else {
    //       callback();
    //     }
    //   });
    // },

    // edit: function(id, name, user, callback) {
    //   db.query("CALL update_campaign(?, ?, ?);", [id, name, user], function(err, docs) {
    //     if (err) {
    //       console.log(err);
    //       callback("Error updating campaign with id: " + id);
    //     } else {
    //       callback();
    //     }
    //   });
    // }

  }

};
