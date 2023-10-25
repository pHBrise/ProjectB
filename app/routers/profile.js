const router = require("express").Router();
const profileController = require("../controllers/profile");
const auth = require("../controllers/auth");
const fileManager = require("../controllers/filemanager");

router.get("/", auth.verifyToken, profileController.getProfile);
router.put("/update", auth.verifyToken, fileManager.singleFileUpload, profileController.updateProfile);
router.get("/:userId/:image",fileManager.getProfileImage);

module.exports = router;