module.exports = function(app, passport, dbApi, controller) {
  var module = {};

  var uuid = require('uuid');


  app.get('/api/domains', passport.isAuthenticated(), function(req, res) {

    var user = req.user;
    var user_id = user.id;

    dbApi.users.findById(user_id, function(err, userData) {

      dbApi.domains.getAll(user, user.aws_root_bucket, function(err, rows) {
        if (err) {
          res.json({
            error: {
              code: "FailedToGetDomains",
            }
          });
        } else {
          res.json(rows);
        }
      });
    });

  });

  app.put('/api/domains/:domain_id', passport.isAuthenticated(), function(req, res) {
    var user = req.user;

    var modelAtributes = req.body;

    dbApi.domains.saveDomain(user, modelAtributes, function() {
      res.json(modelAtributes);
    });

  });

  app.get('/api/domains/notes/:id', passport.isAuthenticated(), function(req, res) {
    var user = req.user;
    var domain_id = req.params['id'];

    dbApi.domains.getDomainNotes(user.aws_root_bucket, domain_id, function(err, dbDomainNotes) {
      if (err) {
        res.json({ error: { code: "CouldNotGetNotes" } });
      } else {
        res.json({ notes: dbDomainNotes });
      }
    });
  });

  app.put('/api/domains/notes/:id', passport.isAuthenticated(), function(req, res) {
    var user = req.user;
    var domainData = req.body;
    var notes = domainData.notes;
    var notes_search = domainData.notes_search;
    //save lander data
    dbApi.domains.updateNotes(user.aws_root_bucket, domainData, function(err) {
      res.json({});
    });
  });

  return module;

}
