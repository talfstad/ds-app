module.exports = function(app, dbApi) {

  var module = {
    keys: require('./keys')(app, dbApi),
    s3: require('./s3')(app, dbApi),
    cloudfront: require('./cloudfront')(app, dbApi),
    route53: require('./route53')(app, dbApi)
  };

  return module;

}