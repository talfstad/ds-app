module.exports = function(app, db, route53, credentials, checkAuth){
    var module = {};

    app.post('/api/domain/create', checkAuth, function(req, res) {
     
    });

    app.put('/api/domain', checkAuth, function(req, res) {
     
    });

    app.delete('/api/domain', checkAuth, function(req, res) {
     
    });

    return module;

}