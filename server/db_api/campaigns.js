module.exports = function(db) {

  var utils = require('../utils/utils.js')();

  return {

    getAll: function(user, successCallback) {

      var user_id = user.id;

      var getAllCampaignsDb = function(gotCampaignsCallback) {
        db.query("SELECT id,name FROM campaigns WHERE user_id = ?", [user_id], function(err, dbCampaigns) {
          if (err) {
            throw err;
          } else {
            gotCampaignsCallback(dbCampaigns);
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
