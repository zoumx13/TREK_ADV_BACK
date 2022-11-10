const parcoursSchema = require("../models/ParcoursSchema");
const User = require("../models/usersModel")

const reservations = {
    createReservations: async (req, res) => {
        const {
            openResa,
            maxClients,
            dateReservation,
            idGuide
        } = req.body;

        try {
            await parcoursSchema.findByIdAndUpdate(
                { _id: req.params.id },

                {
                    $push: {
                        reservations:
                        {
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
                { new: true })
                .then((docs) => res.status(200).json(docs))
                .catch((err) => res.status(400).json(err))



        } catch (err) {
            return res.status(400).send(err);
        }
    },
    deleteReservations: async (req, res) => {
        try {
            await parcoursSchema.findByIdAndUpdate(
                { _id: req.params.id },

                {
                    $pull: {
                        reservations: {

                            _id: req.body.resaId

                        },
                    },
                },
                { new: true })
                .then((docs) => res.status(200).json(docs))
                .catch((err) => res.status(400).json(err))



        } catch (err) {
            return res.status(400).send(err);
        }
    },
    modifyReservations: async (req, res) => {
        const {
            openResa,
            maxClients,
            dateReservation,
            idGuide
        } = req.body;
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
                    )

                    if (!theResa) {
                        return res.status(404).send("Resa not found")
                    } else {
                        theResa.openResa = openResa
                        theResa.maxClients = maxClients
                        theResa.dateReservation = dateReservation
                        theResa.idGuide = idGuide
                        return docs.save((err) => {
                            if (!err) {
                                return res.status(200).send(docs)
                            } else {

                                return res.status(500).send(err);
                            }
                        })
                    }
                }
            );

        } catch (err) {
            return res.status(409).send(err);
        }

    }, 
    getReservationsByIdParcour : async (req,res) => {
         await parcoursSchema.findById(
            { _id: req.params.id })
            
         .then((docs) => res.status(200).json(docs.reservations))
         .catch((err) => res.status(400).json(err))
    },

    getAllReservations : async (req,res) => {
        let userGuide
        let resa=[]
        User.findById(req.body.userId, async(err,user)=>{
            if (user == null) {
                res.status(404).json({ message: "invalid User" });
                console.log('invalid user')
            }else{
                userGuide = JSON.stringify(user._id);
                console.log('profil :',userGuide);
            }
        })
        parcoursSchema.find({}, (err, data) => {
            if (err) {
              res.status(404).json({ message: "Echec" });
              console.log("oups");
            } else {
                console.log("DATA ", data);
                for (let i=0; i<data.length; i++){
                    if(data[i].reservations.length!=0){
                        resa.push(data[i].reservations)
                    }
                }
            }
            res.json(resa);
        })
    },

    addGuideReservations:  (req, res) => {
        const {
            idGuide,
            resaId
        } = req.body;
        
        try {
        
            return ParcoursSchema.findById(
                // trouve le Parcour grâce à son id du params
                req.params.id,
                // appel un callback, pour accéder à docs
                (err, docs) => {
                    // accéder à THE Resa grâce à un find dans la docs , mettre une () avec un param "resa" puis comparé l'id "spé" de la resa avec equals
                    const theResa = docs.reservations.find((resa) =>
                        resa._id.equals(resaId)
                    )

                    if (!theResa) {
                        return res.status(404).send("Resa not found")
                    } else {
                        theResa.idGuide = idGuide
                        return docs.save((err) => {
                            if (!err) {
                                return res.status(200).send(docs)
                            } else {

                                return res.status(500).send(err);
                            }
                        })
                    }
                }
            );

        } catch (err) {
            return res.status(409).send(err);
        }

    }, 

}

module.exports = reservations