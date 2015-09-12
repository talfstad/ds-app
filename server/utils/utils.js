module.exports = function() {

    var module = {};

    var nodemailer = require('nodemailer');

    module.sendEmail = function(fromAddress, fromPassword, toAddress, emailSubject, message, callback) {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: fromAddress,
                pass: fromPassword
            }
        });

        transporter.sendMail({
            from: fromAddress,
            to: toAddress,
            subject: emailSubject,
            text: message
        }, function(err, info){
            if(err){
                console.log(err);
                callback(err);
            } else {
                console.log(info);
                callback(err);
            }
        });
    };

    //if error == null => successful response
    //booleanName is the key of the boolean value in the response
    //if error => responseObject.booleanName = false
    //if booleanOverride is present => responseObject.booleanName = booleanOverride
    module.sendResponse = function(res, error, booleanName, booleanOverride) {
        var responseObject = {};
        if(error) {
           responseObject.error = error;
           responseObject[booleanName] = false; 
        }
        else {
           responseObject.error = '';
           responseObject[booleanName] = true; 
        }

        if(typeof booleanOverride != "undefined") {
            responseObject[booleanName] = booleanOverride;
        }

        res.json(responseObject);
    };

    return module;

}            