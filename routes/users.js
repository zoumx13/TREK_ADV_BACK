const express = require("express");
const router = express.Router();
const users = require("../controllers/usersController");
const middleware = require("../middleware/middlewareAdmin");
const tokenMiddle = require("../middleware/token");
const multer = require("multer");
const upload = multer({ dest: "client/public/uploads/users" });

router.post("/signup", users.CreateUser);
router.post("/signin", users.SignIn);
router.post("/modifyProfilUser", tokenMiddle.token, users.ModifyProfilUser);
router.post("/pictureUser", upload.single("file"), users.UpdateUserPicture);

router.get("/admin", middleware.authentication, users.Admin);
router.get("/user", tokenMiddle.token, users.GetUser);
router.get("/profilUser", tokenMiddle.token, users.GetProfilUser);

/* GET users listing. */
router.post("/");
module.exports = router;
