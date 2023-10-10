const router = require("express").Router();
const profileController = require("../controllers/profile");
const authToken = require("../controllers/authToken");

router.get("/", authToken, profileController.getProfile);

module.exports = router;