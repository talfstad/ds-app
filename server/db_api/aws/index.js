module.exports = function(app, db, base) {

  var module = {
    keys: require('./keys')(app, db, base),
    s3: require('./s3')(app, db, base),
    cloudfront: require('./cloudfront')(app, db, base),
    route53: require('./route53')(app, db, base),
    common: require('./common')(app, db, base)
  };

  return module;
}