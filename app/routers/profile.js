const router = require("express").Router();
const profileController = require("../controllers/profile");
const auth = require("../controllers/auth");
const fileManager = require("../controllers/filemanager");

router.get("/", auth.verifyToken, profileController.getProfile);
router.put("/update", auth.verifyToken, fileManager.uploadProfileImage, profileController.updateProfile);

module.exports = router;