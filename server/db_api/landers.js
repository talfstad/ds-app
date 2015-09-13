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

        get: function(user, callback) {
            db.query("CALL get_lander_info_all(?);", [user], function(err, docs) {
                if (err) {
                    console.log(err);
                    callback("Error updating lander with id: " + id);
                } else {
                    if(docs && docs[0]) {
                        callback(null, docs[0]);
                    }
                }
            });
        }

    }

};