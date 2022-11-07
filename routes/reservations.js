const express = require("express");
const router = express.Router();
const reservations = require("../controllers/reservationsController");

// Route Resa 
router.patch("/createReservations/:id", reservations.createReservations)
router.delete("/deleteReservations/:id", reservations.deleteReservations)
router.patch("/modifyReservations/:id", reservations.modifyReservations)
// router.get("/", reservations.getReservations)




module.exports = router;