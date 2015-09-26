module.exports = function(db) {

  var utils = require('../utils/utils.js')();

  return {
    add: function(name, downloadURL, user, callback) {
      db.query("CALL insert_lander(?, ?, ?);", [name, downloadURL, user], function(err, docs) {
        if (err) {
          console.log(err);
          callback("Error adding lander.");
        } else {
          callback();
        }
      });
    },

    delete: function(id, user, callback) {
      db.query("CALL delete_lander(?, ?);", [id, user], function(err, docs) {
        if (err) {
          console.log(err);
          callback("Error deleting lander with id: " + id);
        } else {
          callback();
        }
      });
    },

    edit: function(id, name, downloadURL, user, callback) {
      db.query("CALL update_lander(?, ?, ?, ?);", [id, name, downloadURL, user], function(err, docs) {
        if (err) {
          console.log(err);
          callback("Error updating lander with id: " + id);
        } else {
          callback();
        }
      });
    },

    getAll: function(user, callback) {
      var mockData = [{
        "id": 1,
        "name": "test lander 1",
        "user": "trevor@buildcave.com",
        "deployed": true,
        "deployedLocations": {
          "hardbodiesandboners.org": [{
            "id": 1,
            "name": "target camp"
          }, {
            "id": 2,
            "name": "RON Camp Test"
          }],
          "weightlosskey.com": [{
            "id": 3,
            "name": "aargete camp 1"
          }, {
            "id": 4,
            "name": "RON2Camp Test 2"
          }]
        },
        "urlEndpoints": [
          "index.html",
          "index1.html",
          "where/here.html",
          "subfolder1/html/bob1.html"
        ],
        "optimizations": {
          "gzip": true,
          "compressJs": false,
          "singleFileJs": true,
          "compressCss": true,
          "singleFileCss": true,
          "compressImg": true,
        },
        "activeJsSnippets": {
          "safepage.html": [{
            "id": 1,
            "name": "JS Cloaker"
          }, {
            "id": 2,
            "name": "JS No-referrer"
          }],
          "index1.html": [{
            "id": 2,
            "name": "JS No-referrer"
          }]
        }
      },
      {
        "id": 2,
        "name": "test lander 234",
        "user": "trevor@buildcave.com",
        "deployed": true,
        "deployedLocations": {
          "hardbodiesandboners.org": [{
            "id": 1,
            "name": "target camp"
          }, {
            "id": 2,
            "name": "RON Camp Test"
          }],
          "weightlosskey.com": [{
            "id": 3,
            "name": "aargete camp 1"
          }, {
            "id": 4,
            "name": "RON2Camp Test 2"
          }]
        },
        "urlEndpoints": [
          "index.html",
          "index1.html",
          "where/here.html",
          "subfolder1/html/bob1.html"
        ],
        "optimizations": {
          "gzip": true,
          "compressJs": false,
          "singleFileJs": true,
          "compressCss": true,
          "singleFileCss": true,
          "compressImg": true,
        },
        "activeJsSnippets": {
          "safepage.html": [{
            "id": 1,
            "name": "JS Cloaker"
          }, {
            "id": 2,
            "name": "JS No-referrer"
          }],
          "index1.html": [{
            "id": 2,
            "name": "JS No-referrer"
          }]
        }
        
      }];

      var user = user.user;
      db.query("CALL get_lander_info_all(?);", [user], function(err, docs) {
        if (err) {
          console.log(err);
          callback("Error updating lander with id: " + id);
        } else {
          // console.log("got lander docs: " + JSON.stringify(docs));
          if (docs && docs[0]) {
            callback(null, mockData);
            // callback(null, docs[0]);
          }
        }
      });
    },

    getById: function(user, id, callback) {
      // db.query("CALL get_lander_info_all(?);", [user], function(err, docs) {
      //   if (err) {
      //     console.log(err);
      //     callback("Error updating lander with id: " + id);
      //   } else {
      //     if (docs && docs[0]) {
      //       callback(null, docs[0]);
      //     }
      //   }
      // });
    }

  }

};
