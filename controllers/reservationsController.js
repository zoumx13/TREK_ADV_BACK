const parcoursSchema = require("../models/ParcoursSchema");

const reservation = {
  createReservations: async (req, res) => {
    const { openResa, maxClients, dateReservation, idGuide } = req.body;
    try {
      await parcoursSchema
        .findByIdAndUpdate(
          { _id: req.params.id },

          {
            $push: {
              reservations: [
                {
                  openResa: openResa,
                  maxClients: maxClients,
                  dateReservation: dateReservation,
                  idGuide: idGuide,

                  // clients : [{
                  //     idClient : idClient,
                  //     etapeCompletee : [{
                  //         nomEtape : nomEtape,
                  //         date : date
                  //     }],
                  //     finished : finished

                  // }]
                },
              ],
            },
          }
        )
        .then((docs) => res.status(200).json(docs))
        .catch((err) => res.status(400).json(err));
    } catch (err) {
      return res.status(400).send(err);
    }
  },
  userReservation: async (req, res) => {
    try {
      const user = req.body.userId;
      const parcourId = req.body.parcoursId;
      const resaId = req.body.resaId;
      console.log(parcourId);
      console.log(resaId);
      console.log(user);
      parcoursSchema.findById(parcourId, (err, docs) => {
        // accéder à THE Resa grâce à un find dans la docs , mettre une () avec un param "resa" puis comparé l'id "spé" de la resa avec equals
        const theResa = docs.reservations.find((resa) =>
          resa._id.equals(req.body.resaId)
        );
        console.log(theResa);
        if (!theResa) {
          res.status(404).send("Resa not found");
        } else {
          const resa = {
            clientId: user,
            date: Date(),
          };
          theResa.clients = resa;
          docs.save((err) => {
            if (!err) {
              res.json({ message: "resa validée" });
            } else {
              res.status(500).send(err);
            }
          });
        }
      });
    } catch (err) {
      res.status(409).send(err);
    }
  },
};

module.exports = reservation;
