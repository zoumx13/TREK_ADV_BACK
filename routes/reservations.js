const express = require("express");
const router = express.Router();
const reservations = require("../controllers/reservationsController");

// Route Resa 
router.patch("/createReservations/:id", reservations.createReservations)
router.delete("/deleteReservations/:id", reservations.deleteReservations)
router.patch("/modifyReservations/:id", reservations.modifyReservations)
router.get("/getReservations/:id", reservations.getReservationsByIdParcour)
router.patch("/addGuideReservations/:id", reservations.addGuideReservations)
// get par id parcour et par id réser
// router.get("/:id", reservations.getReservationsById)




module.exports = router;