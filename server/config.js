module.exports = {
  port: 3000,
  dbConnectionInfo: {
    host : '54.187.184.91',
    // host : 'localhost',
    user : 'root',
    password : 'derekisfat',
    database : 'moonlander',
    multipleStatements: true
  },
  cookieSecret: 'moonlandersecretkeytobechangedlatermaybe123!#',
  sessionSecret: 'moonlandersecretkeytobechangedlatermaybe123!#',
  cookieMaxAge: (1000 * 60 * 60 * 24 * 365),
  adminEmail: 'trevor@buildcave.com',
  adminEmailPassword: 'stackedandjacked',
  resetCodeLifespanMinutes: 240
};