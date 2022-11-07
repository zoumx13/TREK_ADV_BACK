const parcoursSchema = require("../models/ParcoursSchema");

const reservations = {
    createReservations:  async (req, res) => {
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
                        reservations: [
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
                        ],
                    },
                })
                .then((docs) => res.status(200).json(docs))
                .catch((err)=> res.status(400).json(err))
                


        } catch(err) {
            return res.status(400).send(err);

       
      }
    }
    }

module.exports = reservations