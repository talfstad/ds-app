module.exports = function(app, passport) {
    var module = {};

    var csrf = require('csurf');

    app.use(csrf({cookie: true}));

    require('./login')(app, passport);
    require('./landers')(app, passport);
    require('./campaigns')(app, passport);
    require('./domains')(app, passport);
    require('./live_updater')(app, passport);
    

    app.get("*", function(req, res) {
        res.render('index', {
            csrfToken: req.csrfToken()
        });
    });

    return module;
}