const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send("Access Denied");
  try {
    const verified = jwt.verify(token.split(" ")[1], process.env.SECRET_TOKEN, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid token' });
      }
  
      // You can access the user's ID in decodedToken.userId here
      // You can use this ID to fetch user data or perform other actions
      decodedToken._id
      res.status(200).json({ message: 'Access granted user id' + decodedToken._id + decodedToken.email});
    });
    res.status(200).send(verified.user);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
};
