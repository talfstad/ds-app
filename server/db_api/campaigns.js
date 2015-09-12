module.exports = function(db) {

    var utils = require('../utils/utils.js')();

    return {
        add: function(name, user, callback) {
            db.query("CALL insert_campaign(?, ?);", [name, user], function(err, docs) {
                if (err) {
                    console.log(err);
                    callback("Error adding campaign.");
                } else {
                    callback();
                }
            });
        },

        delete: function(id, user, callback) {
            db.query("CALL delete_campaign(?, ?);", [id, user], function(err, docs) {
                if (err) {
                    console.log(err);
                    callback("Error deleting campaign with id: " + id);
                } else {
                    callback();
                }
            });
        },

        edit: function(id, name, user, callback) {
            db.query("CALL update_campaign(?, ?, ?);", [id, name, user], function(err, docs) {
                if (err) {
                    console.log(err);
                    callback("Error updating campaign with id: " + id);
                } else {
                    callback();
                }
            });
        }

    }

};