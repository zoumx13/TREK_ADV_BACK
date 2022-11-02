const express = require("express");
const router = express.Router();
const parcours = require("../controllers/parcoursController");

router.post("/createParcours", parcours.createParcours)
router.delete("/deleteParcours/:id", parcours.deleteParcours)
router.get("/", parcours.getParcours)
router.patch("/modifyParcours/:id", parcours.addStep)


module.exports = router;