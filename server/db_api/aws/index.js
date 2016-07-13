module.exports = function(app, db) {

    var module = {};

    module.keys = require('./keys')(app, db);
    module.s3 = require('./s3')(app, db);
    module.cloudfront = require('./cloudfront')(app, db);
    module.route53 = require('./route53')(app, db);

    return module;

}