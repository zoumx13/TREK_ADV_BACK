const express = require("express");
const router = express.Router();
const reservations = require("../controllers/reservationsController");
const tokenMiddle = require("../middleware/token");

// Route Resa 
router.patch("/createReservations/:id", reservations.createReservations)
router.delete("/deleteReservations/:id", reservations.deleteReservations)
router.patch("/modifyReservations/:id", reservations.modifyReservations)
router.get("/getReservations/:id", reservations.getReservationsByIdParcour)
router.get("/getReservations", reservations.getAllReservations)
router.patch("/addGuideReservations/:id", reservations.addGuideReservations)
router.get("/getAllReservations", tokenMiddle.token , reservations.getAllReservations)





module.exports = router;