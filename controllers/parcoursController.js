const parcoursSchema = require("../models/ParcoursSchema");

const parcours = {

    createParcours: async (req, res) => {
        const { nomParcours, dureeParcours, description, prix, imgIllustration, niveauDifficulte,
            nomEtape, numeroEtape, localisation, descriptionEtape, imgIllustrationEtape
        } = req.body

        const newParcours = new parcoursSchema({
            nomParcours: nomParcours,
            dureeParcours: dureeParcours,
            description: description,
            prix: prix,
            
            // ? = alors
            // Ligne ci-dessous utilisable plus tard avec multer
            //  imgIllustration: req.file !== null ? "./uploads/parcours/" + fileName : "",
            niveauDifficulte: niveauDifficulte,
            etape: [{
                nomEtape: nomEtape,
                numeroEtape: numeroEtape,
                localisation: localisation,
                descriptionEtape: descriptionEtape,
                // Ligne ci-dessous utilisable plus tard avec multer
                //     imgIllustrationEtape: req.file !== null ? "./uploads/etapes/" + fileName : "",

            }
            ]
        });

        try {
            const Parcours = await newParcours.save();
            return res.status(201).json(Parcours);

        } catch (err) {
            return res.status(408).json(err);
        }


    }


};


module.exports = parcours