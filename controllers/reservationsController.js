const parcoursSchema = require("../models/ParcoursSchema");

const reservations = {
    createReservations:  (req, res) => {
        const {
            openResa,
            maxClients,
            dateReservation,
            idGuide,
        } = req.body;
console.log(dateReservation);
            parcoursSchema.findByIdAndUpdate(
                { _id: req.params.id },
    
                {
                    $push: {
                        reservations: [
                            {
                                openResa: openResa,
                                maxClients: maxClients,
                                dateReservation: dateReservation,
                                idGuide: idGuide,
                            },
                        ],
                    },
                },
                (err, data) => {
                    if (err) {
                        res.status(400).json(err);
                        console.log("error", err);
                    } else {
                        console.log("étape ajoutée ", data);
                        res.status(200).json(data);
                    }
                }
            );
        },
    }

module.exports = reservations