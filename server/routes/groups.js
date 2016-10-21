module.exports = function(app, passport, dbApi, controller) {
  var module = {};

  ////ACTIVE CAMPS BELONGING TO A LANDER!
  app.post('/api/active_groups_on_lander', passport.isAuthenticated(), function(req, res) {
    // group_id: "2"
    // lander_id: 1
    // name: "camp1"
    var modelAttributes = req.body;
    var user = req.user;

    dbApi.groups.addActiveGroupToLander(user, modelAttributes, function(err, row) {
      if (err) {
        json.res({ error: err });
      } else {
        res.json(row);
      }
    });
  });

  //updates an active lander on group model
  app.put('/api/active_groups_on_lander/:id', passport.isAuthenticated(), function(req, res) {
    res.json({});
  });

  app.delete('/api/active_groups_on_lander/:id', passport.isAuthenticated(), function(req, res) {

    //remove this by id from the landers with groups table

    dbApi.groups.removeFromLandersWithGroups(req.user, req.params.id, function() {
      res.json({
        success: "true"
      });
    });

  });


  /////ACTIVE CAMPS BELONGING TO DOMAIN!
  app.delete('/api/active_groups_on_domain/:id', passport.isAuthenticated(), function(req, res) {

    dbApi.groups.removeFromGroupsWithDomains(req.user, req.params.id, function(err) {
      if (err) {
        res.json({
          code: "CouldNotDeleteGroupDb"
        });
      } else {
        res.json({
          success: "true"
        });
      }
    });


  });

  app.post('/api/active_groups_on_domain', passport.isAuthenticated(), function(req, res) {
    // group_id: "2"
    // lander_id: 1
    // name: "camp1"
    var modelAttributes = req.body;
    var user = req.user;

    dbApi.groups.addActiveGroupToDomain(user, modelAttributes, function(err, row) {
      if (err) {
        res.json({ error: err });
      } else {
        res.json(row);
      }
    });
  });



  ////CAMPAIGNS
  app.get('/api/groups', passport.isAuthenticated(), function(req, res) {
    var user = req.user;
    dbApi.groups.getAll(user, function(err, rows) {
      if (err) {
        res.json({ error: err });
      }
      res.json(rows);
    });
  });

  //add a new group
  app.post('/api/groups', passport.isAuthenticated(), function(req, res) {

    var user = req.user;
    var newGroupData = req.body;

    dbApi.groups.addNewGroup(user, newGroupData, function(err, responseData) {
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

  //update group name
  app.put('/api/groups/:id', passport.isAuthenticated(), function(req, res) {
    var user = req.user;

    dbApi.groups.updateGroupName(user, req.body, function(err, attributes) {
      if (err) {
        res.json({
          error: err
        });
      } else {
        res.json({});
      }
    });
  });

  app.delete('/api/groups/:id', passport.isAuthenticated(), function(req, res) {
    dbApi.groups.deleteGroup(req.user, req.params.id, function() {
      res.json({
        success: "true"
      });
    });
  });

  app.get('/api/groups/notes/:id', passport.isAuthenticated(), function(req, res) {
    var user = req.user;
    var domain_id = req.params['id'];

    dbApi.groups.getGroupNotes(user, domain_id, function(err, dbDomainNotes) {
      if (err) {
        res.json({ error: { code: "CouldNotGetNotes" } });
      } else {
        res.json({ notes: dbDomainNotes });
      }
    });
  });

  app.put('/api/groups/notes/:id', passport.isAuthenticated(), function(req, res) {
    var user = req.user;
    var domainData = req.body;
    var notes = domainData.notes;
    var notes_search = domainData.notes_search;
    //save lander data
    dbApi.groups.updateNotes(user, domainData, function(err) {
      res.json({});
    });
  });

  return module;

}
