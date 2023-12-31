const router = require("express").Router();
const authToken = require("../middleware/auth");


// Request New Token 
router.post("/token",authToken.verifyLoginToken, authToken.getNewAssetToken);

module.exports = router;