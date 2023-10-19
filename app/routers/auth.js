const router = require("express").Router();
const authToken = require("../controllers/auth");


// Request New Token 
router.post("/token",authToken.verifyToken, authToken.getNewToken);

module.exports = router;