const router = require("express").Router();
const userController = require("../controllers/user");
const authToken = require("../controllers/authToken");
const confirmationEmail = require("../controllers/confirmationEmail");


// Register 
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/newpassword",userController.setupNewPassword);
router.get("/profile", authToken, (req, res) => {
  res.json({ message: "My Profile" });
});

router.get(
  "/email/confirm/:confirmationCode",
  confirmationEmail.verifyEmail,
  (req, res) => {}
);


module.exports = router;
