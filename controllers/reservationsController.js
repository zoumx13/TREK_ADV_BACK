const parcoursSchema = require("../models/ParcoursSchema");
const User = require("../models/usersModel");
const ObjectID = require("mongoose").Types.ObjectId;

const reservations = {
  //CREER UNE RESERVATION
  createReservations: async (req, res) => {
    const { openResa, maxClients, dateReservation, idGuide } = req.body;

    try {
      await parcoursSchema
        .findByIdAndUpdate(
          { _id: req.params.id },

          {
            $push: {
              reservations: {
                openResa: openResa,
                maxClients: maxClients,
                dateReservation: dateReservation,
                idGuide: idGuide,
                // POUR SEB
                // clients : [{
                //     idClient : idClient,
                //     etapeCompletee : [{
                //         nomEtape : nomEtape,
                //         date : date
                //     }],
                //     finished : finished

                // }]
              },
            },
          },
          { new: true }
        )
        .then((docs) => res.status(200).json(docs))
        .catch((err) => res.status(400).json(err));
    } catch (err) {
      return res.status(400).send(err);
    }
  },
  //MODIFIER UNE RESERVATION
  modifyReservations: async (req, res) => {
    const { openResa, maxClients, dateReservation, idGuide, clients } =
      req.body;
    try {
      if (openResa === true || openResa === false) {
        parcoursSchema
          .findOneAndUpdate(
            {
              _id: req.params.idParcours,
              "reservations._id": req.params.idResa,
            },

            {
              $set: {
                "reservations.$.openResa": openResa,
              },
            },
            { new: true }
          )
          .then((docs) => res.json({ message: "Réservation modifiée", docs }))
          .catch((err) => res.status(400).send(err));
      }
      if (maxClients) {
        parcoursSchema
          .findOneAndUpdate(
            {
              _id: req.params.idParcours,
              "reservations._id": req.params.idResa,
            },

            {
              $set: {
                "reservations.$.maxClients": maxClients,
              },
            },
            { new: true }
          )
          .then((docs) => res.json({ message: "Réservation modifiée", docs }))
          .catch((err) => res.status(400).send(err));
      }
      if (dateReservation) {
        parcoursSchema
          .findOneAndUpdate(
            {
              _id: req.params.idParcours,
              "reservations._id": req.params.idResa,
            },

            {
              $set: {
                "reservations.$.dateReservation": dateReservation,
              },
            },
            { new: true }
          )
          .then((docs) => res.json({ message: "Réservation modifiée", docs }))
          .catch((err) => res.status(400).send(err));
      }
      if (idGuide) {
        if (idGuide === "deleteGuide") {
          parcoursSchema
            .findOneAndUpdate(
              {
                _id: req.params.idParcours,
                "reservations._id": req.params.idResa,
              },

              {
                $set: {
                  "reservations.$.idGuide": "",
                },
              },
              { new: true }
            )
            .then((docs) => res.json({ message: "Réservation modifiée", docs }))
            .catch((err) => res.status(400).send(err));
        } else {
          parcoursSchema
            .findOneAndUpdate(
              {
                _id: req.params.idParcours,
                "reservations._id": req.params.idResa,
              },

              {
                $set: {
                  "reservations.$.idGuide": idGuide,
                },
              },
              { new: true }
            )
            .then((docs) => res.json({ message: "Réservation modifiée", docs }))
            .catch((err) => res.status(400).send(err));
        }
      }
      if (clients) {
        parcoursSchema
          .findOneAndUpdate(
            {
              _id: req.params.idParcours,
              "reservations._id": req.params.idResa,
            },

            {
              $set: {
                "reservations.$.clients": clients,
              },
            },
            { new: true }
          )
          .then((docs) => res.json({ message: "Réservation modifiée", docs }))
          .catch((err) => res.status(400).send(err));
      }
    } catch (err) {
      return res.status(400).send(err);
    }
  },
  //SUPPRIMER UNE RESERVATION
  deleteReservations: (req, res) => {
    try {
      return parcoursSchema
        .findByIdAndUpdate(
          { _id: req.params.id },

          {
            $pull: {
              reservations: {
                _id: req.body.resaId,
              },
            },
          },
          { new: true }
        )
        .then((docs) => res.status(200).json(docs))
        .catch((err) => res.status(400).json(err));
    } catch (err) {
      return res.status(400).send(err);
    }
  },

  userReservation: async (req, res) => {
    try {
      const user = req.user._id;
      const identifiant = req.user.identifiant;
      const parcourId = req.body.parcoursId;
      const resaId = req.body.resaId;
      parcoursSchema.findById(parcourId, (err, docs) => {
        // accéder à THE Resa grâce à un find dans la docs , mettre une () avec un param "resa" puis comparé l'id "spé" de la resa avec equals
        const theResa = docs.reservations.find((resa) =>
          resa._id.equals(req.body.resaId)
        );
        if (!theResa) {
          res.status(404).send("Resa not found");
        } else {
          if (!theResa.clients.length <= 0) {
            theResa.clients.push({
              idClient: user,
              identifiant: identifiant,
              date: Date(),
            });
          } else {
            const resa = {
              idClient: user,
              identifiant: identifiant,
              date: Date(),
            };

            theResa.clients = resa;
          }
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

  getReservationsByIdParcour: async (req, res) => {
    await parcoursSchema
      .findById({ _id: req.params.id })

      .then((docs) => res.status(200).json(docs.reservations))
      .catch((err) => res.status(400).json(err));
  },
  //AFFICHAGE DES RESERVATIONS POUR UN GUIDE
  getAllReservationsByGuide: async (req, res) => {
    let userGuide;
    let resa = [];
    User.findById(req.body.userId, async (err, user) => {
      if (user == null) {
        res.status(404).json({ message: "invalid User" });
      } else {
        userGuide = user._id;
        // userGuide = userGuide.replace("''", )
      }
    });
    parcoursSchema.find({}, (err, data) => {
      if (err) {
        res.status(404).json({ message: "Echec" });
      } else {
        for (let i = 0; i < data.length; i++) {
          if (
            data[i].reservations.length != undefined &&
            data[i].reservations.length != 0
          ) {
            for (let y = 0; y < data[i].reservations.length; y++) {
              if (data[i].reservations[y].idGuide == userGuide) {
                resa.push({
                  idparcours: data[i]._id,
                  nomParcours: data[i].nomParcours,
                  imgIllustration: data[i].imgIllustration,
                  reservation: data[i].reservations[y],
                });
              }
            }
          }
        }
      }
      res.json(resa);
    });
  },
  getResaById: (req, res) => {
    let result = [];
    parcoursSchema.findById(req.params.idParcours, (err, data) => {
      if (err) {
        res.status(404).json({ message: "error getResaById", err });
      } else {
        result.push(data);
        data.reservations.map((item) => {
          if (item._id == req.params.idResa) {
            result.push(item);
            result.push(item.clients);
            res.json(result);
          } else {
            console.log("no match id reservation");
          }
        });
      }
    });
  },
  // AFFICHAGE PROCHAINE RESA ADMIN
  nextReservation: async (req, res) => {
    const date = new Date();
    let dateNextResa;
    let nextResa = [];
    parcoursSchema.find({}, (err, data) => {
      if (err) {
        res.status(404).json({ message: "erreur" });
      } else {
        data.map((reservations) => {
          for (let i = 0; i < reservations.reservations.length; i++) {
            let searchDate = new Date(
              reservations.reservations[i].dateReservation
            );
            // if((searchDate > newDate && searchDate < dateNextResa) || dateNextResa == undefined ){
            if (
              searchDate > date &&
              (searchDate < dateNextResa || dateNextResa == undefined)
            ) {
              dateNextResa = searchDate;
              nextResa.splice(0, 1, {
                parcours: reservations,
                reservation: reservations.reservations[i],
              });
              if (reservations.reservations[i].idGuide != "") {
                User.findOne(
                  { _id: reservations.reservations[i].idGuide },
                  (err, data) => {
                    if (err) {
                      res.status(404).json({ message: "Echec" });
                    } else {
                      nextResa.push([data.nom]);
                    }
                  }
                );
              }
            }
          }
        });
        res.json(nextResa);
      }
    });
  },
  //CHARGEMENT DES RESERVATIONS SUR LE CALENDRIER ADMIN ET GESTION RESA
  getAllReservations: async (req, res) => {
    let allReservations = [];
    parcoursSchema.find({}, (err, data) => {
      if (err) {
        res.status(404).json({ message: "erreur" });
      } else {
        data.map((parcours) => {
          for (let i = 0; i < parcours.reservations.length; i++) {
            allReservations.push({
              idparcours: parcours._id,
              nomParcours: parcours.nomParcours,
              idreservation: parcours.reservations[i]._id,
              dateReservation: parcours.reservations[i].dateReservation,
              openResa: parcours.reservations[i].openResa,
              idGuide: parcours.reservations[i].idGuide,
              clients: parcours.reservations[i].clients,
              maxClients: parcours.reservations[i].maxClients,
            });
          }
        });
        res.json(allReservations);
      }
    });
  },
};

module.exports = reservations;
