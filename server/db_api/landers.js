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
        "deploying": true,
        "deployed": true,
        "lastUpdated": "3-2-15",
        "deployedLocations": 
          [{
            "domain": "hardbodiesandboners.org",
            "id": 1,
            "name": "target camp"
          }, 
          {
            "domain": "weightlosskey.com",
            "id": 2,
            "name": "RON Camp Test"
          }],
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
        "activeJsSnippets": []
      },
      {
        "id": 2,
        "name": "test lander 234",
        "user": "trevor@buildcave.com",
        "deployed": false,
        "deploying": false,
        "lastUpdated": "3-1-15",
        "deployedLocations": 
          [{
            "domain": "hardbodiesandboners.org",
            "id": 1,
            "name": "target camp"
          }, 
          {
            "domain": "weightlosskey.com",
            "id": 2,
            "name": "RON Camp Test"
          }],
        "urlEndpoints": [
          "index.html",
          "index1.html",
          "where/here.html",
          "subfolder1/html/bob1.html"
        ],
        "optimizations": {
          "gzip": false,
          "compressJs": false,
          "singleFileJs": false,
          "compressCss": false,
          "singleFileCss": false,
          "compressImg": true,
        },
        "activeJsSnippets": [
          {
            "page": "safepage.html",
            "id": 1,
            "snippets": 
              [{
                "name": "JS Cloaker"
              }, 
              {
                "name": "JS No-referrer"
              }]
          }, {
            "page": "s2afepage2.html",
            "id": 2,
            "name": "JS No-referrer",
            "snippets": 
              [{
                "name": "JS Cloaker"
              }, 
              {
                "name": "JS No-referrer"
              }]
          }]
        
      }];

for(i=23 ; i>3 ; i--) {
      var newDataItem = {
        "id": i,
        "name": "test lander " + i,
        "user": "trevor@buildcave.com",
        "deployed": true,
        "deploying": false,
        "lastUpdated": "3/"+i+"/15",
        "deployedLocations": 
          [{
            "domain": "hardbodiesandboners.org" + i,
            "id": 1,
            "name": "target camp"
          }, 
          {
            "domain": "weightlosskey.com" + i,
            "id": 2,
            "name": "RON Camp Test"
          }],
        "urlEndpoints": [
          "index.html" + i,
          "index1.html" + i,
          "where/here.html" + i,
          "subfolder1/html/bob1.html" + i
        ],
        "optimizations": {
          "gzip": false,
          "compressJs": false,
          "singleFileJs": false,
          "compressCss": false,
          "singleFileCss": false,
          "compressImg": true,
        },
        "activeJsSnippets": [
          {
            "page": "safepage.html" + i,
            "id": 1,
            "snippets": 
              [{
                "name": "JS Cloaker"
              }, 
              {
                "name": "JS No-referrer"
              }]
          }, {
            "page": "s2afepage2.html" + i,
            "id": 2,
            "name": "JS No-referrer",
            "snippets": 
              [{
                "name": "JS No-referrer"
              }]
          }]
}
      mockData.push(newDataItem)
}
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
