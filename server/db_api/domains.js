module.exports = function(db) {

    var utils = require('../utils/utils.js')();

    return {
        add: function(domain, nameservers, user, callback) {
            db.query("CALL insert_domain(?, ?, ?);", [domain, nameservers, user], function(err, docs) {
                if (err) {
                    console.log(err);
                    callback("Error adding lander.");
                } else {
                    callback();
                }
            });
        },

        delete: function(id, user, callback) {
            db.query("CALL delete_domain(?, ?);", [id, user], function(err, docs) {
                if (err) {
                    console.log(err);
                    callback("Error deleting lander with id: " + id);
                } else {
                    callback();
                }
            });
        },

        edit: function(id, name, nameservers, user, callback) {
            db.query("CALL update_domain(?, ?, ?, ?);", [id, domain, nameservers, user], function(err, docs) {
                if (err) {
                    console.log(err);
                    callback("Error updating lander with id: " + id);
                } else {
                    callback();
                }
            });
        }

    }

};