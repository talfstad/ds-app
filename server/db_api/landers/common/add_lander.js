module.exports = function(db) {

  return {

    addOptimizePushSave: function(stagingPath, landerData, callback) {

      //1. createDirectory in s3 for original
	  //2. push original to s3
	  //3. optimize the staging directory
	  //4. createDirectory in s3 for optimized
	  //5. push optimized
	  //6. pagespeed test endpoints (deployed endpoints)
	  //7. save lander into DB, save endpoints into DB (create stored proc for this?)

      callback(false, landerData);


    }

  }
}