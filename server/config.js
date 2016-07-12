module.exports = {
  id: 1,
  port: 3000,
  dbConnectionInfo: {
    host: 'landerds-app.cynwtdt18kyi.us-west-2.rds.amazonaws.com',
    user: 'buildcave',
    password: 'Wewillrockyou1986!',
    database: 'test',
    //database: 'prod',  
    multipleStatements: true,
    connectionLimit: 10
  },
  redisConnectionInfo: {
    // host: '52.39.113.167',
    host: '10.35.0.166', //use for deployment
    port: 6379,
    db: 0,
    pass: 'Wewillrockyou1986!',
    logErrors: false
  },
  cookieSecret: 'landerdssecretkeytobechangedlatermaybe123!#',
  sessionSecret: 'landerdssecretkeytobechangedlatermaybe123!#',
  cookieMaxAge: (1000 * 60 * 60 * 24 * 365),
  awsRegion: "us-west-2",
  workers: {
    checkOthersFinishedRate: 1000 * 30, // 30 seconds
    redeployCheckIfMasterReadyRate: 1000 * 5 // 5 seconds
  },
  cloudfront: {
    invalidationPollDuration: 1000 * 30 // 30 seconds
  }
};