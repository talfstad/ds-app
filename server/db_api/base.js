module.exports = function(app, db) {

  var module = {
    users: require('./users/base')(app, db),
    landers: require('./landers/base')(app, db),
    groups: require('./groups/base')(app, db),
    domains: require('./domains/base')(app, db),
    js_snippets: require('./js_snippets/base')(app, db),
    updater: require('./updater/base')(app, db),
    jobs: require('./jobs/base')(app, db),
    aws: require('./aws/base')(app, db),
    common: require('./common/base')(app, db),
    log: require('./log/base')(app, db),
    deployed_domain: require('./deployed_domain/base')(app, db)
  };

  return module;
}