module.exports = function(app, db, credentials, checkAuth){
    var module = {};

    app.post('/api/campaign', checkAuth, function(req, res) {
     
    });

    app.put('/api/campaign', checkAuth, function(req, res) {
     
    });

    app.delete('/api/campaign', checkAuth, function(req, res) {
     
    });

    return module;

}