module.exports = function(app, passport) {
  var module = {};

  var db = require("../db_api");


  ////ACTIVE CAMPS BELONGING TO A LANDER!
  app.post('/api/active_campaigns_on_lander', passport.isAuthenticated(), function(req, res) {
    // campaign_id: "2"
    // lander_id: 1
    // name: "camp1"
    var modelAttributes = req.body;
    var user = req.user;

    db.campaigns.addActiveCampaignToLander(user, modelAttributes, function(err, row) {
      if(err){
        json.res({error: err});
      } else {
        res.json(row);
      }
    });

  });

  //updates an active lander on campaign model
  app.put('/api/active_campaigns_on_lander/:id', passport.isAuthenticated(), function(req, res) {
    res.json({});
  });

  app.delete('/api/active_campaigns_on_lander/:id', passport.isAuthenticated(), function(req, res) {

    //remove this by id from the landers with campaigns table

    db.campaigns.removeFromLandersWithCampaigns(req.user, req.params.id, function() {
      res.json({
        success: "true"
      });
    });

  });


  /////ACTIVE CAMPS BELONGING TO DOMAIN!
  app.delete('/api/active_campaigns_on_domain/:id', passport.isAuthenticated(), function(req, res) {

    db.campaigns.removeFromCampaignsWithDomains(req.user, req.params.id, function(err) {
      if (err) {
        res.json({
          code: "CouldNotDeleteCampaignDb"
        });
      } else {
        res.json({
          success: "true"
        });
      }
    });


  });

  app.post('/api/active_campaigns_on_domain', passport.isAuthenticated(), function(req, res) {
    // campaign_id: "2"
    // lander_id: 1
    // name: "camp1"
    var modelAttributes = req.body;
    var user = req.user;

    db.campaigns.addActiveCampaignToDomain(user, modelAttributes, function(err, row) {
      if(err){
        res.json({error: err});
      } else {
        res.json(row);
      }
    });
  });



  ////CAMPAIGNS
  app.get('/api/campaigns', passport.isAuthenticated(), function(req, res) {
    var user = req.user;
    db.campaigns.getAll(user, function(err, rows) {
      if (err) {
        res.json({error: err});
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

  //update campaign name
  app.put('/api/campaigns/:id', passport.isAuthenticated(), function(req, res) {
    var user = req.user;
    
    db.campaigns.updateCampaignName(user, req.body, function(err, attributes){
      if(err){
        res.json({
          error: err
        });
      } else {
        res.json({});
      }
    });
  });

  app.delete('/api/campaigns/:id', passport.isAuthenticated(), function(req, res) {
    db.campaigns.deleteCampaign(req.user, req.params.id, function() {
      res.json({
        success: "true"
      });
    });
  });

  return module;

}
