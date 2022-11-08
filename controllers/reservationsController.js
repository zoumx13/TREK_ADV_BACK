const ParcoursSchema = require("../models/ParcoursSchema");
const parcoursSchema = require("../models/ParcoursSchema");

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
    modifyReservations:  (req, res) => {
        const {
            openResa,
            maxClients,
            dateReservation,
            idGuide
        } = req.body;
        //    A FINIR 
        try {
        //////////////////////////////////////////////////////////////////////////////////////////////////// 
            // Ne fonctionne pas, je garde pour demander durant un coaching
            // const theParcour = await parcoursSchema.findById(
            //     { _id: req.params.id })
            //     console.log("SEARCH : ", theParcour.reservations)

            //         // theParcour.reservations.find()
            //  let theResa = await theParcour.reservations.findByIdAndUpdate((resaSpe) => 
            //     ( resaSpe._id.equals(req.body.resaId)),
                
            //     {
            //         $set: {
            //             reservations: {
            //                 openResa: openResa,
            //                 maxClients: maxClients,
            //                 dateReservation: dateReservation,
            //                 idGuide: idGuide
            //             },
            //         },
            //     },
            //     { new: true })
            //     // .then((docs) => {return docs.save})
            //     .then ((docs) => res.status(200).json(docs))
            //     .catch((err) => res.status(408).json(err))
           
        ////////////////////////////////////////////////////////////////////////////////////////////////////    
            return ParcoursSchema.findById(
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
            // console.log("SEARCH : ", theParcour.reservations)
         .then((docs) => res.status(200).json(docs.reservations))
         .catch((err) => res.status(400).json(err))
    }

}

module.exports = reservations