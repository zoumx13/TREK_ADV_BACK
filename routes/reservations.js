const express = require("express");
const router = express.Router();
const reservations = require("../controllers/reservationsController");
const tokenMiddle = require("../middleware/token");

// Route Resa
router.patch("/createReservations/:id", reservations.createReservations);
// router.delete("/deletereservations", reservations.deleteReservations)
// router.patch("/modifyReservations", reservations.modifyReservations)
// router.get("/", reservations.getReservations)
router.post("/user", tokenMiddle.token, reservations.userReservation);

module.exports = router;
