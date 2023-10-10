const nodemailer = require("nodemailer");
const User = require("../models/User");
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "phbrise@gmail.com",
    pass: "eofb abmp hmos sshb",
  },
});

module.exports.sendConfirmationEmail = async (email, confirmationCode) => {
  const confirmationLink = `http://localhost:4000/user/email/confirm/${confirmationCode}`;
  const mailOptions = {
    from: transporter.user,
    to: email,
    subject: "Email Confirmation",
    html: `Click the following link to confirm your email address: <a href="${confirmationLink}">${confirmationLink}</a>`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports.verifyEmail = async (req, res, next) => {
  try {
    const token = req.params.confirmationCode;
    console.log("Email Confirmation token:" + token);
    const user = await User.findOneAndUpdate(
      { secret_login: token },
      { email_confirmed: true, secret_login: null }
    );

    if (!user) {
      return res.status(404).json({ message: "Email confirmation failed" });
    }

    res.json({ message: "Email confirmed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
