const express = require("express");
const router = express.Router();
const reservations = require("../controllers/reservationsController");
const tokenMiddle = require("../middleware/token");

// Route Resa
//CREER RESERVATION
router.patch("/createReservations/:id", reservations.createReservations);
//MODIFIER RESERVATION
router.patch("/modifyReservations/:idParcours/:idResa", reservations.modifyReservations);
//SUPPRIMER RESERVATION 
router.delete("/deleteReservations/:id", reservations.deleteReservations);


//AFFICHER TOUTES LES RESERVATIONS CALENDRIER ADMIN
router.get("/allReservations", tokenMiddle.checkToken, reservations.getAllReservations)
//TOUTES LES RESERVATION D'UN PARCOURS
router.get("/getReservations/:id", reservations.getReservationsByIdParcour);
//AFFICHER TOUTES LES RESERVATION D'UN GUIDE
router.get(
  "/getAllReservationsByGuide",
  tokenMiddle.token,
  reservations.getAllReservationsByGuide
);
//AFFICHER UNE RESERVATION PAR ID
router.get("/:idParcours/:idResa", reservations.getResaById);
//AFFICHAGE PROCHAINE RESERVATION POUR ADMIN
router.get("/nextReservation", tokenMiddle.token, reservations.nextReservation);


//INSCRIPTION RESERVATION CLIENT
router.post("/user", tokenMiddle.checkToken, reservations.userReservation);


// router.get("/getReservations", reservations.getAllReservations);

module.exports = router;
