const express = require("express");
const router = express.Router();
const parcours = require("../controllers/parcoursController");

router.post("/createParcours", parcours.createParcours)
router.delete("/deleteParcours/:id", parcours.deleteParcours)
router.modify("/modifyParcours/:id", parcours.modifyParcours)
router.get("/", parcours.getParcours)
router.patch("/addStep/:id", parcours.addStep)
router.delete("/deleteStep/:id", parcours.deleteStep)


module.exports = router;