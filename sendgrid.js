const sgMail = require("@sendgrid/mail");
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (message) => {
  const msg = {
    to: "liam@tone.co.uk",
    from: "codeexpert74@gmail.com",
    subject: "Hello Team!",
    text: message,
    html: `<div>${message}</div>`,
  };

  sgMail
    .send(msg)
    .then((response) => {
      console.log(response[0].statusCode);
      console.log(response[0].headers);
    })
    .catch((error) => {
      console.error(error);
    });
};


module.exports = {
  sendEmail,
};
