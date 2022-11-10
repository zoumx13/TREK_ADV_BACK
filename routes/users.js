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
router.post(
  "/pictureUser",
  tokenMiddle.checkToken,
  upload.single("file"),
  users.updatePicture
);

router.get("/profilUser", tokenMiddle.token, users.GetProfilUser);
router.post("/createguide", middleware.authentication, users.CreateUser);
router.post("/mailguide", middleware.authentication, users.MailGuide);
router.post("/reservationuser", users.GetUser);
router.get("/admin", middleware.authentication, users.Admin);
router.get("/user", tokenMiddle.token, users.GetUser);
router.get("/listguide", middleware.authentication, users.ListGuide);

router.get("/guide", middleware.authentication, users.GetUser);


/* GET users listing. */
router.post("/");
module.exports = router;
