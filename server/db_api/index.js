module.exports = function(app, db) {

  var base = require("./base")(app, db);

  var module = {
    users: require('./users')(app, db, base),
    landers: require('./landers')(app, db, base),
    groups: require('./groups')(app, db, base),
    domains: require('./domains')(app, db, base),
    js_snippets: require('./js_snippets')(app, db, base),
    updater: require('./updater')(app, db, base),
    jobs: require('./jobs')(app, db, base),
    aws: require('./aws')(app, db, base),
    common: require('./common')(app, db, base),
    log: require('./log')(app, db, base),
    deployed_domain: require('./deployed_domain')(app, db, base)
  };

  return module;
}