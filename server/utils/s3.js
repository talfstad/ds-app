module.exports = function(access_key_id, secret_access_key){
    var module = {};

    var path = require("path");
    var s3 = require('s3');
    var fs = require('fs');
    var walk = require('walk');
    var make_uuid = require('node-uuid');
    var mkdirp = require('mkdirp');
    var cmd = require('child_process');
    var config = require("../config");
    var moment = require("moment");
    var string = require('string');

    var AWS = require('aws-sdk');

    AWS.config.update({
        accessKeyId: access_key_id,
        secretAccessKey: secret_access_key
    });

    var aws_s3_client = new AWS.S3();

    module.testFunction = function (){
        console.log("This is an example of how to export a function");
    };

    var s3_client = s3.createClient({
        maxAsyncS3: 20,     // this is the default
        s3RetryCount: 3,    // this is the default
        s3RetryDelay: 1000, // this is the default
        multipartUploadThreshold: 20971520, // this is the default (20 MB)
        multipartUploadSize: 15728640, // this is the default (15 MB)
        s3Options: {
            accessKeyId: access_key_id,
            secretAccessKey: secret_access_key,
            // any other options are passed to new AWS.S3()
            // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
        },
    });

    module.archiveLander = function(bucket_name, bucket_path, file_path, file_name, callback) {
        var error;

        bucket_path = string(bucket_path).chompLeft('/').chompRight('/').s;

        var bucket_key = bucket_path + "/" + file_name;

        var bucket_params = {
          localFile: file_path,

          s3Params: {
            Bucket: bucket_name,
            Key: bucket_key,
            ACL: "public-read"
            // other options supported by putObject, except Body and ContentLength.
            // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
          }
        };

        //console.log("Copying " + file_path + " to " + archive_path + "/" + zip_name);
        console.log("Uploading to s3 bucket: " + bucket_name + "/" + bucket_path)

        var uploader = s3_client.uploadFile(bucket_params);

        uploader.on('error', function(err) {
            error = "Unable to upload:" + err.stack;
            callback(error, download_url)
            return;
        });

        uploader.on('progress', function() {
          //console.log("Upload Progress: ", uploader.progressMd5Amount, uploader.progressAmount, uploader.progressTotal);
        });

        uploader.on('end', function() {
          console.log("Done uploading.");
          var download_url = s3.getPublicUrlHttp(bucket_name, bucket_key);
          callback(error, download_url);
          return;
        });
        
    };

    function createStagingPath(unique_zip_name, callback){
        var error;

        var unique_str = unique_zip_name.split('.')[0];

        var staging_path = "/staging/" + unique_str;
        var created_path =  config.staging_root + staging_path;

        console.log("Creating staging path: " + created_path)

        mkdirp(created_path, function (err) {
            if(err) {
                console.log(err);
                error = "Server error making staging directory."
            }
            callback(error, created_path);
        });
    };

    function stageFile(file_path, staging_path, zip_name, callback) {
        var error;

        //req.files.myFile.path

        console.log("Copying " + file_path + " to " + staging_path + "/" + zip_name);

        fs.rename(
            file_path,
            staging_path + "/" + zip_name,
            function(err) {
                if(err) {
                    console.log(err);
                    error = 'Server error writing file.'
                }
                callback(error);
            }
        );
    };

    function unzip(zip_path, index_name, zip_name, callback) {
        var error;
        var index_path_and_name;

        var outdir = zip_path + '/sync';

        var unzip_cmd = 'unzip -o ' + zip_path + "/" + zip_name + ' -d ' + outdir;
        //var find_cmd = 'find ' + zip_path + ' -name \"' + index_name +'\"';
        cmd.exec(unzip_cmd, function (err, stdout, stderr) {
            if(!err) {
                // cmd.exec(find_cmd, function (err, stdout, stderr) {
                //     var lines = stdout.split('\n');
                //     if(lines.length == 1) {
                //         index_path_and_name = lines[0];
                //         callback(index_path_and_name, error)
                //     }
                //     else if (lines.length > 1){
                //         index_path_and_name = lines[0];
                //         console.log("Warning: more than one index file with name=" + index_name + ". Using first one...");
                //         callback(index_path_and_name, error)
                //     }
                //     else {
                //         error = "Index file not found."
                //         callback('', error)
                //     }
                // });
                callback(error, outdir);
            }
            else {
                error = "Error unziping file";
                cleanUpStaging(zip_path);
                callback(error, outdir);
            }
        });
    };

    // function gzip(unzip_root_path, skip, callback) {
    //     var error;
    //     var options;
    //     var walker;

    //     if(skip == false) {
    //         // To be truly synchronous in the emitter and maintain a compatible api, 
    //         // the listeners must be listed before the object is created 
    //         options = {
    //             listeners: {
    //                 names: function (root, nodeNamesArray) {
    //                     nodeNamesArray.sort(function (a, b) {
    //                         if (a > b) return 1;
    //                         if (a < b) return -1;
    //                         return 0;
    //                     });
    //                 }
    //                 , directories: function (root, dirStatsArray, next) {
    //                     // dirStatsArray is an array of `stat` objects with the additional attributes 
    //                     // * type 
    //                     // * error 
    //                     // * name 

    //                     next();
    //                 }
    //                 , file: function (root, fileStats, next) {
    //                     fs.readFile(fileStats.name, function () {
    //                         // doStuff 
    //                         next();
    //                     });
    //                 }
    //                 , errors: function (root, nodeStatsArray, next) {
    //                     next();
    //                 }
    //             }
    //         };

    //         walker = walk.walkSync("/tmp", options);

    //         console.log("all done");
    //     }
    //     else {
    //         callback(error);
    //     }
    // }

    function cleanUpStaging(staging_path, callback){
        var error;
        console.log("Cleaning up staging path: " + staging_path);

        cmd.exec("rm -rf " + staging_path, function (err, stdout, stderr) {
            if(err) {
                error = "Could not clean up staging directory: " + staging_path;
            }
            callback(error);
        });
    };

    function syncDirectoryToS3(directory, bucket_name, bucket_path, callback) {
        var error;

        var params = {
          localDir: directory,
          deleteRemoved: true, // default false, whether to remove s3 objects 
                               // that have no corresponding local file. 
         
          s3Params: {
            Bucket: bucket_name,
            Prefix: bucket_path,
            ACL: "public-read"
            // other options supported by putObject, except Body and ContentLength. 
            // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property 
          },
        };

        var uploader = s3_client.uploadDir(params);
        uploader.on('error', function(err) {
          console.error("unable to sync:", err.stack);
        });

        uploader.on('progress', function() {
          //console.log("progress", uploader.progressAmount, uploader.progressTotal);
        });

        uploader.on('end', function() {
          console.log("done uploading");
          callback(error);
          return;
        });
    };


    module.createBucket = function(bucket_name, callback) {
        var error;

        var params = {
          Bucket: bucket_name, /* required */
          ACL: 'public-read'
        };

        var bucket_exists;

        aws_s3_client.createBucket(params, function(err, data) {
            if (err) {
                if(err.code == 'BucketAlreadyExists') {
                    callback('Bucket already exists.');
                }
                else if(err.code == 'BucketAlreadyOwnedByYou') {
                    //just move along, nothing to see here
                    console.log('Bucket already owned by me, moving to next step');
                    callback(error);
                }
                else {
                    console.log(err, err.stack); // an error occurred
                    error = "Failure creating bucket: " + bucket_name; 
                    callback(error)
                }
                
            }
            else {
                console.log(data); // successful response
                callback(error);
            }
        });

    };

    module.uploadLanderToS3 = function(file_path, unique_file_name, zip_name, bucket_name, bucket_path, index_name, callback) {
        
        var staging_path;
        var error;

        createStagingPath(unique_file_name, function(staging_path, error) {
            if(error) {
                console.log(error);
                callback(error);
            }
            else {
                zip_path=staging_path;
            }

            stageFile(file_path, staging_path, zip_name, function(error) {
                if(error) {
                    console.log(error);
                    callback(error);
                }

                unzip(staging_path, index_name, zip_name, function(unzip_path, error) {
                    if(error) {
                        console.log(error);
                        callback(error);
                    }

                    syncDirectoryToS3(unzip_path, bucket_name, bucket_path, function(error) {
                        if(error) {
                            console.log(error);
                            callback(error);
                        }
                        else {
                            cleanUpStaging(staging_path, function(error) {
                                if(error) {
                                    console.log("Warning: " + error);
                                }
                                callback(error);
                            });
                        }

                    }); //getLanderId
                }); //unzip 
            }); //stageFile
       
        }); //createStagingPath
    };

    return module;
}