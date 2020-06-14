const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");

const transporter = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: process.env.SESSION_USER,
      pass: process.env.SESSION_PASS
    }
  })
);

module.exports.send = function(email, subject, mess) {
  var mailOptions = {
    from: "Book managements <any@pvt.com>",
    to: email,
    subject: subject,
    text: "For clients with plaintext support only",
    html: mess
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
