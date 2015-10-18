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
        "deployed_status": "deployed",
        "lastUpdated": "3-2-15",
        "deployedLocations": //made up of domain models
          [{
            "id": 1,
            "domain": "hardbodiesandboners.org",
            "deploy_status": "deployed"
          }, 
          {
            "id": 2,
            "domain": "weightlosskey.com",
            "deploy_status": "deployed"
          }],
        "urlEndpoints": [
          "index.html",
          "index1.html",
          "where/here.html",
          "subfolder1/html/bob1.html"
        ],
        "optimizations": {
          "gzip": true,
          "optimizeJs": false,
          "optimizeCss": true,
          "optimizeImg": true
        },
        "activeJsSnippets": [],
        "activeJobs": []
      },
      {
        "id": 2,
        "name": "test lander 234",
        "user": "trevor@buildcave.com",
        "deployed_status": "deploying",
        "lastUpdated": "3-1-15",
        "deployedLocations": 
          [{
            "id": 1,
            "domain": "hardbodiesandboners.org",
            "deploy_status": "deploying"
          }, 
          {
            "id": 2,
            "domain": "weightlosskey.com",
            "deploy_status": "deployed"
          }],
        "urlEndpoints": [
          "index.html",
          "index1.html",
          "where/here.html",
          "subfolder1/html/bob1.html"
        ],
        "optimizations": {
          "gzip": false,
          "optimizeJs": false,
          "optimizeCss": false,
          "optimizeImg": false
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
        "deployed_status": "deployed",
        "lastUpdated": "3/"+i+"/15",
        "deployedLocations": 
          [{
            "id": 1,
            "domain": "hardbodiesandboners.org",
            "deploy_status": "deployed"
          }, 
          {
            "id": 2,
            "domain": "weightlosskey.com",
            "deploy_status": "deployed"
          }],
        "urlEndpoints": [
          "index.html" + i,
          "index1.html" + i,
          "where/here.html" + i,
          "subfolder1/html/bob1.html" + i
        ],
        "optimizations": {
          "gzip": true,
          "optimizeJs": true,
          "optimizeCss": true,
          "optimizeImg": true
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
