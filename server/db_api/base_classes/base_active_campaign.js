module.exports = function(app, db) {


  var module = {

    getExtraNestedForActiveCampaign: function(user, activeCampaign, callback) {

      var user_id = user.id;

      var getAllLandersOnActiveCampaign = function(activeCampaign, callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
          } else {
            connection.query("SELECT a.lander_id,b.name FROM landers_with_campaigns a JOIN landers b ON a.lander_id = b.id WHERE (a.user_id = ? AND a.campaign_id = ?)", [user_id, activeCampaign.campaign_id],
              function(err, dbLanders) {
                if (err) {
                  callback(err);
                } else {
                  callback(false, dbLanders);
                }
                connection.release();
              });
          }
        });
      };

      var getAllDomainsOnActiveCampaign = function(activeCampaign, callback) {
        db.getConnection(function(err, connection) {
          if (err) {
            callback(err);
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

          getAllLandersOnActiveCampaign(activeCampaign, function(err, dbLanders) {
            if (err) {
              callback(err);
            } else {
              activeCampaign.landers = dbLanders;
              callback(false);
            }
          });
        }
      });
    }

  };
  return module;
};
