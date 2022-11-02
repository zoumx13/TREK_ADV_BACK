const express = require("express");
const router = express.Router();
const users = require("../controllers/usersController");
const middleware = require("../middleware/middlewareAdmin");

router.post("/signup", users.CreateUser);
router.post("/signin", users.SignIn);
router.get("/admin", middleware.authentication, users.Admin);

/* GET users listing. */
router.post("/");
module.exports = router;
