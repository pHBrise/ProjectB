const router = require("express").Router();


router.get('/', (req, res) => {
    res.render( '../app/views/home');
});

router.get('/home', (req, res) => {
    res.render('../views/home');
});

router.get('/login', (req, res) => {
    res.render( '../app/views/login');
});

router.get('/register', (req, res) => {
    res.render(__dirname + '/register');
});
module.exports = router;