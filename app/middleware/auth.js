const jwt = require("jsonwebtoken");
const userModel = require("../models/User");

module.exports.verifyToken = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send("Access Denied");
  try {
    jwt.verify(token, process.env.SECRET_TOKEN, async (err, playload) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
      const user = await userModel.findOne({ _id: playload._id, secret_login: playload.secret_login })
      if (user) {
        req.user = user;
        next();
      } else return res.status(401).json({ message: 'Invalid user' });
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};


module.exports.getNewToken = async (req, res) => {
  const asset_token = jwt.sign({ _id: req.user._id, secret_login: req.user.secret_login }, process.env.SECRET_TOKEN, {
    expiresIn: "1h",
  });

  res.status(200).json({ asset_token: asset_token })

};
