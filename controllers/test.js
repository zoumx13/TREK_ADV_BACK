const parcoursSchema = require("../models/ParcoursSchema");
const User = require("../models/usersModel");
const ObjectID = require("mongoose").Types.ObjectId;

const reservations = {
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
          theResa.clients.push({
            idClient: user,
            date: Date(),
          }),
            // theResa.clients = resa;

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
  modifyReservations: async (req, res) => {
    const { openResa, maxClients, dateReservation, idGuide } = req.body;
    //    A FINIR
    try {
      ////////////////////////////////////////////////////////////////////////////////////////////////////
      //     // Recherche du parcours
      //     const theParcour = await parcoursSchema.findById({ _id: req.params.id });
      //     console.log("SEARCH : ", theParcour.reservations);

      //     // Vérification de l'existence du parcours
      //     if (!theParcour) {
      //       throw new Error("Parcours not found");
      //     }

      //     // Recherche de la réservation
      //     await theParcour.reservations.findByIdAndUpdate(
      //       req.body.resaId,
      //       {
      //         $set: {
      //           reservations: {
      //             openResa: openResa,
      //             maxClients: maxClients,
      //             dateReservation: dateReservation,
      //             idGuide: idGuide,
      //           },
      //         },
      //       },
      //       { new: true }
      //     );
      //     res.status(200).json(theParcour)
      //   } catch (err) {
      //     return res.status(409).send(err);
      //   }
      // },
      ////////////////////////////////////////////////////////////////////////////////////////////////////
      return parcoursSchema.findById(
        // trouve le Parcour grâce à son id du params
        req.params.id,
        // appel un callback, pour accéder à docs
        (err, docs) => {
          // accéder à THE Resa grâce à un find dans la docs , mettre une () avec un param "resa" puis comparé l'id "spé" de la resa avec equals
          const theResa = docs.reservations.find((resa) =>
            resa._id.equals(req.body.resaId)
          );

          if (!theResa) {
            return res.status(404).send("Resa not found");
          } else {
            theResa.openResa = openResa;
            theResa.maxClients = maxClients;
            theResa.dateReservation = dateReservation;
            theResa.idGuide = idGuide;
            return docs.save((err) => {
              if (!err) {
                return res.status(200).send(docs);
              } else {
                return res.status(500).send(err);
              }
            });
          }
        }
      );
    } catch (err) {
      return res.status(409).send(err);
    }
  },
  getReservationsByIdParcour: async (req, res) => {
    await parcoursSchema
      .findById({ _id: req.params.id })

      .then((docs) => res.status(200).json(docs.reservations))
      .catch((err) => res.status(400).json(err));
  },

  getAllReservations: async (req, res) => {
    let userGuide;
    let resa = [];
    User.findById(req.body.userId, async (err, user) => {
      if (user == null) {
        res.status(404).json({ message: "invalid User" });
        console.log("invalid user");
      } else {
        userGuide = user._id;
        // userGuide = userGuide.replace("''", )
        console.log("profil :", userGuide);
      }
    });
    parcoursSchema.find({}, (err, data) => {
      if (err) {
        res.status(404).json({ message: "Echec" });
        console.log("oups");
      } else {
        for (let i = 0; i < data.length; i++) {
          if (
            data[i].reservations.length != undefined &&
            data[i].reservations.length != 0
          ) {
            for (let y = 0; y < data[i].reservations.length; y++) {
              if (data[i].reservations[y].idGuide == userGuide) {
                console.log("IMAGE :", data[i].imgIllustration);
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
        console.log("oups");
      } else {
        result.push(data);
        console.log("parcours chargé", data);
        console.log("resa chargé", data.reservations);
        data.reservations.map((item) => {
          if (item._id == req.params.idResa) {
            console.log("match id reservation");
            result.push(item);
            result.push(item.clients);
          }
        });
        res.json(result);
      }
    });
    // for (let z=0 ; z<item.clients.length; z++){
    //   console.log("clieeeeeeeeeeeeeeeeeeents ",item.clients[z])
    //   User.findById(item.clients[z].idClient, (err, donnes) => {
    //     if (err) {
    //       res.status(404).json({ message: "error clients", err });
    //       console.log("oups");
    //     } else {
    //       console.log("clients ", donnes);
    //       result.push({
    //         nomClient: donnes.nom,
    //         prenomClient : donnes.prenom,
    //         descriptionClient : donnes.description,
    //         photoClient: donnes.photo_profil,
    //         placesReserves : 0,
    //       });
    //     }
    //   })
    // }
  },
  addGuideReservations: (req, res) => {
    const { idGuide, resaId } = req.body;

    try {
      return parcoursSchema.findById(
        // trouve le Parcour grâce à son id du params
        req.params.id,
        // appel un callback, pour accéder à docs
        (err, docs) => {
          // accéder à THE Resa grâce à un find dans la docs , mettre une () avec un param "resa" puis comparé l'id "spé" de la resa avec equals
          const theResa = docs.reservations.find((resa) =>
            resa._id.equals(resaId)
          );

          if (!theResa) {
            return res.status(404).send("Resa not found");
          } else {
            console.log("THE RESAAAA CHARGEE");
            console.log("THE RESAAAA", theResa);
            console.log("NO THE RESAAAA");
            theResa.idGuide = idGuide;
            return docs.save((err) => {
              console.log("DOOOOCS", docs.theResa);
              if (!err) {
                return res.status(200).send(docs);
              } else {
                return res.status(501).send(err);
              }
            });
          }
        }
      );
    } catch (err) {
      return res.status(409).send(err);
    }
  },
  nextReservation: async (req, res) => {
    const date = new Date();
    const newDate = date.toISOString().slice(0, 10);
    let dateNextResa;
    let nextResa = [];
    parcoursSchema.find({}, (err, data) => {
      if (err) {
        res.status(404).json({ message: "erreur" });
      } else {
        data.map((reservations) => {
          // console.log("RESERVATION.RESA ", reservations.reservations)
          for (let i = 0; i < reservations.reservations.length; i++) {
            let searchDate = reservations.reservations[i].dateReservation;
            console.log("SEARCHDATE", searchDate);
            if (
              (searchDate > newDate && searchDate < dateNextResa) ||
              dateNextResa == undefined
            ) {
              dateNextResa = searchDate;
              nextResa.splice(0, 1, {
                parcours: reservations,
                reservation: reservations.reservations[i],
              });
            }
          }
        });
        User.findOne({ _id: nextResa[0].reservation.idGuide }, (err, data) => {
          if (err) {
            res.status(404).json({ message: "Echec" });
          } else {
            nextResa.push(data.nom);
            console.log("nextResa end ", nextResa);
            res.json(nextResa);
          }
        });
      }
    });
  },
};

module.exports = reservations;
