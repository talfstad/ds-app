module.exports = function(db) {

  return {

    saveDomain: function(user, model, successCallback, errorCallback) {
      //update model stuff into domains where id= model.id
      db.query("UPDATE domains SET domain = ?, nameservers = ? WHERE user_id = ? AND id = ?", [model.domain, model.nameservers, user.id, model.id],
        function(err, docs) {
          if (err) {
            console.log(err);
            errorCallback("\nError saving domain.");
          } else {
            successCallback(docs);
          }
        });

    }
  }
};
