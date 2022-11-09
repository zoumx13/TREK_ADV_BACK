const express = require("express");
const router = express.Router();
const users = require("../controllers/usersController");
const middleware = require("../middleware/middlewareAdmin");
const tokenMiddle = require("../middleware/token");

router.post("/signup", users.CreateUser);
router.post("/signin", users.SignIn);
router.post("/createguide", middleware.authentication, users.CreateUser);
router.post("/reservationuser", users.GetUser);
router.get("/admin", middleware.authentication, users.Admin);
router.get("/user", tokenMiddle.token, users.GetUser);

router.get("/listguide", middleware.authentication, users.ListGuide);

router.get("/guide", middleware.authentication, users.GetUser);


/* GET users listing. */
router.post("/");
module.exports = router;
