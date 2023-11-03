const router = require("express").Router();
const profileController = require("../controllers/profile");
const auth = require("../middleware/auth");
const fileManager = require("../middleware/filemanager");

router.get("/", auth.verifyAssetToken, profileController.getProfile);
router.put("/update", auth.verifyAssetToken, fileManager.singleFileUpload, profileController.updateProfile);
router.get("/:userId/:image",fileManager.getProfileImage);

module.exports = router;