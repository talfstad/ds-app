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
    }

    return module;

}            