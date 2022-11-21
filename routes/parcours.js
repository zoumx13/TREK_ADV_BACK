const express = require("express");
const router = express.Router();
const parcours = require("../controllers/parcoursController");
const multer = require("multer");
const uploadParcours = multer({ dest: "client/public/uploads/parcours" });
const uploadStep = multer({ dest: "client/public/uploads/etapes" });

// Route Parcours
router.post("/createParcours", parcours.createParcours);
router.delete("/deleteParcours/:id", parcours.deleteParcours);
router.patch("/modifyParcours/:id", parcours.modifyParcours);
router.get("/", parcours.getParcours);
router.get("/:id", parcours.getParcoursById);
router.post(
  "/createImageParcours/:id",
  uploadParcours.single("file"),
  parcours.addImgParcours
);
// Route Etape
router.patch("/addStep/:id", parcours.addStep);
router.delete("/deleteStep/:id/:idStep", parcours.deleteStep);
router.post("/modifyStep/:id/:idStep", parcours.modifyStep);
router.post(
  "/createImageStep/:id/:idStep",
  uploadStep.single("file"),
  parcours.addImgStep
);

module.exports = router;
