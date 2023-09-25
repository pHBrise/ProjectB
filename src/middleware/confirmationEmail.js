const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "phbrise@gmail.com",
    pass: "54823/qoIi",
  },
});

module.exports = (email, confirmationCode) => {
  transport.sendMail({
      from: user,
      to: email,
      subject: "Please confirm your account",
      html: `<h1>Email Confirmation</h1>
          <p>Please confirm your email by clicking on the following link</p>
          <a href=http://localhost:4000/confirm/${confirmationCode}> Click here</a>
          </div>`,
    })
    .catch((err) => console.log(err));
};
