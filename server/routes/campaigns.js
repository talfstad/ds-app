module.exports = function(app, passport) {
  var module = {};

  var db = require("../db_api");


  ////ACTIVE CAMPS BELONGING TO A LANDER!
  app.post('/api/active_campaigns', passport.isAuthenticated(), function(req, res) {
    // campaign_id: "2"
    // lander_id: 1
    // name: "camp1"
    var modelAttributes = req.body;
    var user = req.user;

    db.campaigns.addActiveCampaign(user, modelAttributes, function(row) {
      res.json(row)
    });

  });

  app.delete('/api/active_campaigns/:id', passport.isAuthenticated(), function(req, res) {

    //remove this by id from the landers with campaigns table

    db.campaigns.removeFromLandersWithCampaigns(req.user, req.params.id, function() {

      res.json({
        success: "true"
      });

    });



  });


  /////ACTIVE CAMPS BELONGING TO DOMAIN!
  app.delete('/api/active_campaigns_on_domain/:id', passport.isAuthenticated(), function(req, res) {

    db.campaigns.removeFromCampaignsWithDomains(req.user, req.params.id, function() {

      res.json({
        success: "true"
      });

    });


  });

  app.post('/api/active_campaigns_on_domain', passport.isAuthenticated(), function(req, res) {
    // campaign_id: "2"
    // lander_id: 1
    // name: "camp1"
    var modelAttributes = req.body;
    var user = req.user;

    db.campaigns.addActiveCampaignToDomain(user, modelAttributes, function(row) {
      res.json(row)
    });

  });



  ////CAMPAIGNS
  app.get('/api/campaigns', passport.isAuthenticated(), function(req, res) {
    var user = req.user;
    db.campaigns.getAll(user, function(err, rows) {
      if (err) {
        console.log("error getting campaigns: " + JSON.stringify(err));
      }
      res.json(rows);
    });
  });

  //add a new campaign
  app.post('/api/campaigns', passport.isAuthenticated(), function(req, res) {
    
    var user = req.user;
    var newCampaignData = req.body;

    db.campaigns.addNewCampaign(user, newCampaignData, function(err, responseData) {
      if (err) {
        res.json({
          error: err
        });
      } else {
        //5. return the data with an id, etc to the gui model
        res.json(responseData);
      }
    });


  });

  app.put('/api/campaigns', passport.isAuthenticated(), function(req, res) {

  });

  app.delete('/api/campaigns', passport.isAuthenticated(), function(req, res) {

  });

  return module;

}
