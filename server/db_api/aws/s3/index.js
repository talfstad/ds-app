module.exports = function(app, db, base) {

  var module = _.extend({
    

  }, base.aws.s3);

  return module;
};