module.exports = function(db) {

    var module = {};

    module.keys = require('./keys')(db);
    module.s3 = require('./s3')(db);
    module.cloudfront = require('./cloudfront')(db);
    module.route53 = require('./route53')(db);

    return module;

}