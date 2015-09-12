module.exports = function(app, db, credentials, checkAuth){
    var module = {};

    app.post('/campaign', checkAuth, function(req, res) {
     
    });

    app.put('/campaign', checkAuth, function(req, res) {
     
    });

    app.delete('/campaign', checkAuth, function(req, res) {
     
    });

    return module;

}