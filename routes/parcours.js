const express = require("express");
const router = express.Router();
const parcours = require("../controllers/parcoursController");

router.post("/createParcours", parcours.createParcours)




module.exports = router;