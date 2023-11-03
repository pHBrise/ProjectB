const jwt = require("jsonwebtoken");
const userModel = require("../models/User");

module.exports.verifyAssetToken = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "token not found"
    })
  }
  try {
    jwt.verify(token, process.env.SECRET_ASSET_TOKEN, async (err, playload) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: err.message,
          error: err
        });
      }
      const user = await userModel.findOne({ _id: playload._id, secret_login: playload.secret_login })
      if (user) {
        req.user = user;
        next();
      } else return res.status(401).json({
        success: false,
        message: "Invalid token"
      })
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error
    });
  }
};

module.exports.verifyLoginToken = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "token not found"
    });
  } 
  try {
    jwt.verify(token, process.env.SECRET_LOGIN_TOKEN, async (err, playload) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: err.message,
          error: err
        });
      }
      const user = await userModel.findOne({ _id: playload._id, secret_login: playload.secret_login })
      if (user) {
        req.user = user;
        next();
      } else return res.status(401).json({ message: 'Invalid user' });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error
    });
  }
};

module.exports.getNewAssetToken = async (req, res) => {
  const asset_token = jwt.sign({ _id: req.user._id, secret_login: req.user.secret_login }, process.env.SECRET_ASSET_TOKEN, {
    expiresIn: "1h",
  });
  res.status(200).json({
    success: true,
    message: "get new token success",
    data: {
      asset_token: asset_token
    }
  });
};
