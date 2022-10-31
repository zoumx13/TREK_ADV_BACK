var express = require('express');
var router = express.Router();
var users = require('../controllers/users_controller');



/* GET users listing. */
router.post("/login", users.ConnexionUser);

module.exports = router;
