module.exports = function(app, passport) {
    var module = {};

    var csrf = require('csurf');

    app.use(csrf({cookie: true}));

    require('./login')(app, passport);
    require('./landers')(app, passport);

    app.get("*", function(req, res) {
        res.render('index', {
            csrfToken: req.csrfToken()
        });
    });

    return module;
}