const express = require("express");
const router = express.Router();
const reservations = require("../controllers/reservationsController");

// Route Resa 
router.patch("/createReservations/:id", reservations.createReservations)
// router.delete("/deletereservations", reservations.deleteReservations)
// router.patch("/modifyReservations", reservations.modifyReservations)
// router.get("/", reservations.getReservations)




module.exports = router;