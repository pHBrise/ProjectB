const router = require("express").Router();
const authToken = require("../middleware/auth");

router.get('/', (req, res) => {
    res.render(__dirname + '/app/views/index');
});

router.get('/home', (req, res) => {
    res.render(__dirname + '/app/views/home');
});

router.get('/login', (req, res) => {
    res.render(__dirname + '/app/views/login');
});

router.get('/register', (req, res) => {
    res.render(__dirname + '/app/views/register');
});
module.exports = router;