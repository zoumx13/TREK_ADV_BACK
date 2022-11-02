const express = require("express");
const router = express.Router();
const users = require("../controllers/usersController");

router.post("/signup", users.CreateUser);
router.post("/signin", users.SignIn);
/* GET users listing. */
router.post("/");
module.exports = router;
