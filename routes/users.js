const express = require("express");
const router = express.Router();
const users = require("../controllers/usersController");
const middleware = require("../middleware/middlewareAdmin");
const middlewareGuide = require("../middleware/middlewareGuide");
const tokenMiddle = require("../middleware/token");
const multer = require("multer");
const upload = multer({ dest: "client/public/uploads/users" });


//CONTEXT USER
router.get("/user", tokenMiddle.token, users.GetUser);

//CREER CLIENT
router.post("/signup", users.CreateUser);
//AJOUT IMAGE CLIENT
router.post(
  "/pictureUser",
  tokenMiddle.checkToken,
  upload.single("file"),
  users.updatePicture
);
//CONNEXION CLIENT
router.post("/signin", users.SignIn);
//MODIFIER CLIENT
router.post(
  "/modifyProfilUser",
  tokenMiddle.checkToken,
  users.ModifyProfilUser
);

//CREER GUIDE
router.post("/createguide", middleware.authentication, users.CreateUser);
//AJOUT IMAGE GUIDE
router.post(
  "/imgUser/:idGuide",
  tokenMiddle.checkToken,
  upload.single("file"),
  users.updateImgUser
);
//MAIL PASSWORD GUIDE
router.post("/mailguide", middleware.authentication, users.MailGuide);
//MODIFIER GUIDE
router.patch(
  "/modifyGuideadmin/:idGuide",
  tokenMiddle.checkToken,
  users.modifyUserGuide
);
//SUPPRIMER GUIDE
router.delete(
  "/deleteGuideadmin/:id",
  tokenMiddle.checkToken,
  users.deleteGuide
);


router.get("/profilUser", tokenMiddle.token, users.GetProfilUser);
router.post("/reservationuser", tokenMiddle.checkToken, middleware.authentication, users.GetUser);
router.post("/loaddetailsguide", tokenMiddle.checkToken, users.GetUser);
router.get("/admin", tokenMiddle.checkToken, users.Admin);
// EXTRACTION USERS
// router.get("/listguide", tokenMiddle.checkToken, users.ListGuide);
router.get("/allUsers", tokenMiddle.checkToken, users.AllUsers);


// /* GET users listing. */
// router.post("/");
module.exports = router;
