module.exports = function(app, db) {

  var module = {
    keys: require('./keys/base')(app, db),
    s3: require('./s3/base')(app, db),
    cloudfront: require('./cloudfront/base')(app, db),
    route53: require('./route53/base')(app, db),
    common: require('./common/base')(app, db)
  };

  return module;

}