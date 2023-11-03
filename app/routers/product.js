const router = require("express").Router();
const auth = require("../middleware/auth");
const fileManager = require("../middleware/filemanager");
const productController = require("../controllers/product");

router.post("/new", auth.verifyAssetToken,fileManager.multipleFileUpload, productController.addProduct)

module.exports = router;