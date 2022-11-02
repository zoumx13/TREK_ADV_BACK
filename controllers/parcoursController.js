const parcoursSchema = require("../models/ParcoursSchema");

const parcours = {

    createParcours: async (req, res) => {
        const { nomParcours, dureeParcours, description, prix, imgIllustration, niveauDifficulte,
            nomEtape, numeroEtape, localisation, descriptionEtape, imgIllustrationEtape
        } = req.body

        const newParcours = new parcoursSchema({
            nomParcours: req.body.nomParcours,
            dureeParcours: dureeParcours,
            description: req.body.description,
            prix: req.body.prix,
            // ? = alors
            imgIllustration: req.file !== null ? "./uploads/parcours/" + fileName : "",
            niveauDifficulte: req.body.niveauDifficulte,
            etape: [{
                nomEtape: req.body.nomEtape,
                numeroEtape: req.body.numeroEtape,
                localisation: req.body.localisation,
                descriptionEtape: req.body.descriptionEtape,
                imgIllustrationEtape: req.file !== null ? "./uploads/etapes/" + fileName : "",

            }
            ]
        });

        try {
            const newParcours = await newParcours.save();
            return res.status(201).json(newParcours);

        } catch (err) {
            return res.status(400).send(err);
        }


    }


};


module.exports = parcours