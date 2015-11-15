module.exports = function(app, db, passport) {
  var module = {};

  var db = require("../db_api");


////ACTIVE CAMPS BELONGING TO A LANDER!
  app.post('/api/active_campaigns', function(req, res) {
    // campaign_id: "2"
    // lander_id: 1
    // name: "camp1"
    var modelAttributes = {
      campaign_id: req.body.campaign_id,
      lander_id: req.body.lander_id
    }

    var user = req.user;
    db.campaigns.addActiveCampaign(user, modelAttributes, function(row) {
      res.json(row)
    });

  });

  app.delete('/api/active_campaigns/:id', function(req, res) {
    
    //remove this by id from the landers with campaigns table

    db.campaigns.removeFromLandersWithCampaigns(req.user, req.params.id, function(){

      res.json({success: "true"});

    });



  });



////CAMPAIGNS
  app.get('/api/campaigns', function(req, res) {
    var user = req.user;
    db.campaigns.getAll(user, function(rows) {
      res.json(rows);
    });
  });

  app.post('/api/campaigns', function(req, res) {

  });

  app.put('/api/campaigns', function(req, res) {

  });

  app.delete('/api/campaigns', function(req, res) {

  });

  return module;

}
