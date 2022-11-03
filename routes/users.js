const express = require("express");
const router = express.Router();
const users = require("../controllers/usersController");
const middleware = require("../middleware/middlewareAdmin");
const tokenMiddle = require("../middleware/token");

router.post("/signup", users.CreateUser);
router.post("/signin", users.SignIn);
router.get("/admin", middleware.authentication, users.Admin);
router.get("/user", tokenMiddle.token, users.GetUser);

/* GET users listing. */
router.post("/");
module.exports = router;
