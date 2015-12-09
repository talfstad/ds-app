module.exports = function(db) {

  return {

    getAll: function(user, successCallback) {

      var user_id = user.id;

      var getAllDomainsDb = function(gotDomainsCallback) {
        db.getConnection(function(err, connection) {
          if (err) {
            console.log(err);
          }
          connection.query("SELECT id,domain FROM domains WHERE user_id = ?", [user_id], function(err, dblanders) {
            if (err) {
              console.log(err);
            } else {
              gotDomainsCallback(dblanders);
            }
            connection.release();
          });
        });
      };


      //call to get all and return rows
      getAllDomainsDb(function(domains) {
        return successCallback(domains);
      });



      ///////MOCK DATA FOR GET ALL LANDERS ////////////      
      // [{
      //   id: 1,
      //   domain: "www.hardbodiesandboners.org"
      // }]

    },


    saveDomain: function(user, model, successCallback, errorCallback) {
      //update model stuff into domains where id= model.id
      db.getConnection(function(err, connection) {
        if (err) {
          console.log(err);
        } else {
          connection.query("UPDATE domains SET domain = ?, nameservers = ? WHERE user_id = ? AND id = ?", [model.domain, model.nameservers, user.id, model.id],
            function(err, docs) {
              if (err) {
                console.log(err);
                errorCallback("\nError saving domain.");
              } else {
                successCallback(docs);
              }
              connection.release();
            });
        }
      });

    }
  }
};
