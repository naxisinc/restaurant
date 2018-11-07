const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'naxiscorp@gmail.com',
    clientId:
      '627992287596-t8um17lif02tr52nodqltr1nd9rl1f4p.apps.googleusercontent.com',
    clientSecret: 'mlAXvdriY0WlFNCgjtsHORsI',
    refreshToken: '1/c5fbUeaUyqzHig97rN7yifYG75pDC3IoyxNN2vJ5lic'
  },
  tls: {
    rejectUnauthorized: false // para evitar self signed certificate in certificate chain
  }
});

module.exports.sendEmail = mailOptions => transporter.sendMail(mailOptions);
