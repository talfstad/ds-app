module.exports = function(app) {

  var sendEmail = function(fromAddress, fromPassword, toAddress, emailSubject, message, callback) {
    var nodemailer = require('nodemailer');

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
      html: message
    }, function(err, info) {
      if (err) {
        console.log(err);
        callback(err);
      } else {
        console.log(info);
        callback(err);
      }
    });


  };

  return sendEmail;
};
