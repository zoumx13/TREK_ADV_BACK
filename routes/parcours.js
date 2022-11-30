const express = require("express");
const router = express.Router();
const parcours = require("../controllers/parcoursController");
const multer = require("multer");
const uploadParcours = multer({ dest: "client/public/uploads/parcours" });
const uploadStep = multer({ dest: "client/public/uploads/etapes" });
const tokenMiddle = require("../middleware/token");

// Route Parcours
//CREER PARCOURS ADMIN
router.post("/createParcours", tokenMiddle.checkToken, parcours.createParcours);
//AJOUT IMAGE PARCOURS ADMIN
router.post(
  "/createImageParcours/:id",
  uploadParcours.single("file"),
  parcours.addImgParcours
);
//MODIFIER PARCOURS ADMIN
router.patch(
  "/modifyParcours/:id",
  tokenMiddle.checkToken,
  parcours.modifyParcours
);
//SUPPRIMER ETAPE ADMIN
router.delete(
  "/deleteParcours/:id",
  tokenMiddle.checkToken,
  parcours.deleteParcours
);

// Route Etape
//AJOUT ETAPE ADMIN
router.patch("/addStep/:id", tokenMiddle.checkToken, parcours.addStep);
//AJOUT IMAGE ETAPE ADMIN
router.post(
  "/createImageStep/:id/:idStep",
  uploadStep.single("file"),
  parcours.addImgStep
);
//MODIFIER ETAPE ADMIN
router.post(
  "/modifyStep/:id/:idStep",
  tokenMiddle.checkToken,
  parcours.modifyStep
);
//SUPPRIMER ETAPE ADMIN
router.delete(
  "/deleteStep/:id/:idStep",
  tokenMiddle.checkToken,
  parcours.deleteStep
);

router.get("/", tokenMiddle.checkToken, parcours.getParcours);
router.get("/:id", tokenMiddle.checkToken, parcours.getParcoursById);


module.exports = router;
