const router = require("express").Router();
const userRegister = require("../middleware/user/userRegister");
const authToken = require("../middleware/authToken");
const userLogin = require("../middleware/user/userLogin");
const confirmationEmail = require("../middleware/confirmationEmail");

router.get("/profile", authToken, (req, res) => {
  res.json({ message: "My Profile" });
});
router.get(
  "/email/confirm/:confirmationCode",
  confirmationEmail.verifyEmail,
  (req, res) => {}
);
router.post("/register", userRegister, (req, res) => {});

router.post("/login", userLogin, (req, res) => {});

module.exports = router;
