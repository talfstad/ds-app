module.exports = function(app, db) {


  var module = {

    getExtraNestedForActiveCampaign: function(user, activeCampaign, lander, callback) {

      var user_id = user.id;

      var getAllDomainsOnActiveCampaign = function(activeCampaign, callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            console.log(err);
          } else {
            connection.query("SELECT a.domain_id,b.domain FROM campaigns_with_domains a JOIN domains b ON a.domain_id = b.id WHERE (a.user_id = ? AND a.campaign_id = ?)", [user_id, activeCampaign.campaign_id],
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
      };

      getAllDomainsOnActiveCampaign(activeCampaign, function(err, dbDomains) {
        if (err) {
          callback(err);
        } else {
          activeCampaign.domains = dbDomains;

          callback(false);
        }
      });
    }

  };
  return module;
};
