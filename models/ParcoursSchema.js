const mongoose = require("mongoose");

const ClientDetail = new mongoose.Schema({
  idClient: {
    type: String,
    required: true,
  },

  etapeCompletee: [
    {
      nomEtape: String,
      date: String,
    },
  ],

  finished: {
    type: Boolean,
  },
});

const ReservationDetail = new mongoose.Schema({
  openResa: {
    type: Boolean,
  },

  dateReservation: {
    type: String,
  },
  idGuide: {
    type: String,
  },
  maxClients: {
    type: String,
  },
  clients: [
    {
      idClient: String,
      identifiant: String,
      date: String,
      etapeCompletee: [
        {
          nomEtape: String,
          date: String,
        },
      ],

      finished: {
        type: Boolean,
      },
    },
  ],
});
const EtapeDetail = new mongoose.Schema({
  nomEtape: {
    type: String,
  },
  numeroEtape: {
    type: String,
  },
  localisation: [
    {
      lat: String,
      long: String,
    },
  ],
  descriptionEtape: {
    type: String,
  },
  imgIllustrationEtape: {
    // Stockez l'image dans un dossier static. Type = String à cause du chemin
    type: String,
    default: "./uploads/etapes/img_etapes.png",
  },
});

const Parcours = new mongoose.Schema({
  nomParcours: {
    type: String,

    unique: true,
  },
  dureeParcours: {
    type: String,
  },
  description: {
    type: String,
  },
  prix: {
    type: String,
  },
  imgIllustration: {
    // Stockez l'image dans un dossier static. Type = String à cause du chemin
    type: String,
    default: "plan_avenir_montagne.jpg",
  },
  niveauDifficulte: {
    type: Number,
  },

  reservations: [ReservationDetail],

  etape: [EtapeDetail],
});

module.exports = mongoose.model("Parcours", Parcours);
