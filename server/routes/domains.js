module.exports = function(app, db, passport) {
    var module = {};

    app.post('/api/domains', function(req, res) {
     
    });

    app.put('/api/domains/:domain_id', function(req, res) {
      res.json({
      	id: req.params.domain_id,
      	processing: true //set after worker has been started
      });

    });

    app.delete('/api/domains', function(req, res) {
     
    });

    return module;

}