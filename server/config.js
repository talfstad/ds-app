module.exports = {

  /*
  id is super important and must be unique to the server!
  */
  id: 1,

  port: 3000,
  dbConnectionInfo: {
    host : '52.88.173.62',
    // host : 'localhost',
    user : 'root',
    password : 'Wewillrockyou1986!',
    database : 'moonlander',
    multipleStatements: true,
    connectionLimit: 10
  },
  cookieSecret: 'moonlandersecretkeytobechangedlatermaybe123!#',
  sessionSecret: 'moonlandersecretkeytobechangedlatermaybe123!#',
  cookieMaxAge: (1000 * 60 * 60 * 24 * 365),
  adminEmail: 'trevor@buildcave.com',
  adminEmailPassword: 'stackedandjacked',
  resetCodeLifespanMinutes: 240
};