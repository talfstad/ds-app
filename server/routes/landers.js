module.exports = function(app, db, passport){
    var module = {};

    var config = require("../config");
    var Puid = require('puid');
    var utils = require('../utils/utils.js')();
    var db = require("../db_api");

    app.post('/api/lander', function(req, res) {
        var lander_name = req.body.lander_name;
        var zip_full_path = req.files.myFile.path;
        var zip_name=req.files.myFile.originalname;

        var user = req.user;

        var uid = req.signedCookies.uid;
        var access_key_id = req.signedCookies.access_key_id;
        var secret_access_key = req.signedCookies.secret_access_key;

        var bucket_name = uid; //the archive bucket is the user's uid
        var puid = new Puid(true);
        var bucket_path = puid.generate(); //generate a random bucket path for the archive

        var s3 = require('../utils/s3')(access_key_id, secret_access_key);

        s3.archiveLander(bucket_name, bucket_path, zip_full_path, zip_name, function(error, download_url) {
            if(error) {
                utils.sendResponse(res, error, "landerUploaded");
            }
            else {
                db.landers.add(lander_name, download_url, user, function(error) {
                    utils.sendResponse(res, error, "landerAdded");
                });
            }
        });

    });

    app.get('/api/landers', function(req,res) {
        var user = req.user;
        db.landers.get(user, function(error, rows) {
            var responseObject = {rows : rows};
            utils.sendResponse(res, error, "landersFound", true, responseObject);
        });
    });

    app.get('/api/lander', function(req,res) {
        
    });

    app.put('/api/lander', function(req, res) {
     
    });

    app.delete('/api/lander', function(req, res) {
     
    });

    return module;

}