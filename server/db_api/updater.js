module.exports = function(db) {

  return {

    getActiveJobs: function(user, successCallback, errorCallback) {

      var user_id = user.id;

      db.query("SELECT * FROM jobs WHERE processing = ? AND user_id = ?", [true, user.id], function(err, docs) {
        if (err) {
          console.log(err);
          errorCallback("Error getting active jobs.");
        } else {
          successCallback(docs);
        }
      });
    }


  }

};
