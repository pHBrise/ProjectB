const router = require("express").Router();
const auth = require("../controllers/auth");
const fileManager = require("../controllers/filemanager");
const productController = require("../controllers/product");

router.post("/new", auth.verifyToken,fileManager.multipleFileUpload, productController.addProduct)

module.exports = router;