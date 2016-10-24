module.exports = {

  dev: {
    id: 1,
    subdomain: "test",
    port: 3000,
    dbConnectionInfo: {
      host: 'landerds-app.cynwtdt18kyi.us-west-2.rds.amazonaws.com',
      user: 'buildcave',
      password: 'Wewillrockyou1986!',
      database: 'test_db',
      //database: 'prod',  
      multipleStatements: true,
      connectionLimit: 50
    },
    redisConnectionInfo: {
      host: '52.39.113.167',
      port: 6379,
      db: 0,
      pass: 'Wewillrockyou1986!',
      logErrors: false
    },
    jobTimeoutLimit: 1000,
    resetPasswordCodeLifespanMinutes: 10,
    adminEmail: "trevor@buildcave.com",
    adminEmailPassword: "Wewillrockyou1986!",
    cookieSecret: 'landerdssecretkeytobechangedlatermaybe123!#',
    sessionSecret: 'landerdssecretkeytobechangedlatermaybe123!#',
    cookieMaxAge: (1000 * 60 * 60 * 24 * 365),
    awsRegion: "us-west-2",
    workers: {
      checkOthersFinishedRate: 1000 * 30, // 30 seconds
      redeployCheckIfMasterReadyRate: 1000 * 10 // 5 seconds
    },
    aws: {
      s3Credentials: {
        accessKeyId: "AKIAIGEHZO373H6MTW6Q",
        secretAccessKey: "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"
      },
      bucketName: "landerds-add-lander-errors"
    },
    cloudfront: {
      invalidationPollDuration: 1000 * 60 // 30 seconds
    },
    s3: {
      getLockPollDuration: 1000 * 5, // 5 seconds
      lockTimeout: 1000 * 30 // 30 seconds
    },
    optimize: {
      images: false
    },
    noGzipArr: ['mp4', 'mp3'],
    logLevel: 'all'
  },

  prod: {
    id: 1,
    port: 3000,
    subdomain: "panel",
    dbConnectionInfo: {
      host: 'landerds-app.cynwtdt18kyi.us-west-2.rds.amazonaws.com',
      user: 'buildcave',
      password: 'Wewillrockyou1986!',
      database: 'test_db',
      //database: 'prod',  
      multipleStatements: true,
      connectionLimit: 50
    },
    redisConnectionInfo: {
      host: '10.35.0.166', //use for deployment
      port: 6379,
      db: 0,
      pass: 'Wewillrockyou1986!',
      logErrors: false
    },
    jobTimeoutLimit: 1000 * 60 * 30,
    resetPasswordCodeLifespanMinutes: 10,
    adminEmail: "trevor@buildcave.com",
    adminEmailPassword: "Wewillrockyou1986!",
    cookieSecret: 'landerdssecretkeytobechangedlatermaybe123!#',
    sessionSecret: 'landerdssecretkeytobechangedlatermaybe123!#',
    cookieMaxAge: (1000 * 60 * 60 * 24 * 365),
    awsRegion: "us-west-2",
    workers: {
      checkOthersFinishedRate: 1000 * 30, // 30 seconds
      redeployCheckIfMasterReadyRate: 1000 * 5 // 5 seconds
    },
    aws: {
      s3Credentials: {
        accessKeyId: "AKIAIGEHZO373H6MTW6Q",
        secretAccessKey: "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"
      },
      bucketName: "landerds-add-lander-errors"
    },
    cloudfront: {
      invalidationPollDuration: 1000 * 30 // 30 seconds
    },
    s3: {
      getLockPollDuration: 1000 * 5, // 5 seconds
      lockTimeout: 1000 * 30 // 30 seconds
    },
    optimize: {
      images: true
    },
    noGzipArr: ['mp4', 'mp3'],
    logLevel: 'all'
  }
};
