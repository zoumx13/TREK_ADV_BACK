const express = require("express");
const router = express.Router();
const parcours = require("../controllers/parcoursController");

// Route Parcours 
router.post("/createParcours", parcours.createParcours)
router.delete("/deleteParcours/:id", parcours.deleteParcours)
router.patch("/modifyParcours/:id", parcours.modifyParcours)
router.get("/", parcours.getParcours)
router.get("/:id", parcours.getParcoursById)
// Route Etape
router.patch("/addStep/:id", parcours.addStep)
router.delete("/deleteStep/:id", parcours.deleteStep)


module.exports = router;