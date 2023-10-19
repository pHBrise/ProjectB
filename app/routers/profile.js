const router = require("express").Router();
const profileController = require("../controllers/profile");
const auth = require("../controllers/auth");

router.get("/", authToken, profileController.getProfile);

module.exports = router;