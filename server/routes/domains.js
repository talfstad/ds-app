module.exports = function(app, db, route53, credentials, checkAuth){
    var module = {};

    app.post('/domain/create', checkAuth, function(req, res) {
     
    });

    app.put('/domain', checkAuth, function(req, res) {
     
    });

    app.delete('/domain', checkAuth, function(req, res) {
     
    });

    return module;

}