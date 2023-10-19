const router = require("express").Router();
const userController = require("../controllers/user");
const auth = require("../controllers/auth");
const confirmationEmail = require("../controllers/confirmationEmail");


// Register 
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/newpassword", authToken, userController.setupNewPassword);

router.get(
  "/email/confirm/:confirmationCode",
  confirmationEmail.verifyEmail,
  (req, res) => {}
);


module.exports = router;
