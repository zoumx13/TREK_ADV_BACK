const parcoursSchema = require("../models/ParcoursSchema");

const parcours = {
  createParcours: async (req, res) => {
    const {
      nomParcours,
      dureeParcours,
      description,
      prix,
      imgIllustration,
      niveauDifficulte,
      nomEtape,
      numeroEtape,
      localisation,
      descriptionEtape,
      imgIllustrationEtape,
    } = req.body;

    const newParcours = new parcoursSchema({
      nomParcours: nomParcours,
      dureeParcours: dureeParcours,
      description: description,
      prix: prix,

      // ? = alors
      // Ligne ci-dessous utilisable plus tard avec multer
      //  imgIllustration: req.file !== null ? "./uploads/parcours/" + fileName : "",
      niveauDifficulte: niveauDifficulte,
      etape: [
        {
          nomEtape: nomEtape,
          numeroEtape: numeroEtape,
          localisation: localisation,
          descriptionEtape: descriptionEtape,
          // Ligne ci-dessous utilisable plus tard avec multer
          //     imgIllustrationEtape: req.file !== null ? "./uploads/etapes/" + fileName : "",
        },
      ],
    });

    try {
      const Parcours = await newParcours.save();
      return res.status(201).json(Parcours);
    } catch (err) {
      return res.status(404).json(err);
    }
  },
  deleteParcours: (req, res) => {
    parcoursSchema.findByIdAndRemove({ _id: req.params.id }, (err, data) => {
      if (err) {
        res.status(404).json({ message: "error", err });
      } else {
        res.status(200).json({ message: "data", data });
        console.log("parcours supprimé");
      }
    });
  },
  getParcours: (req, res) => {
    parcoursSchema.find({}, (err, data) => {
      if (err) {
        res.status(404).json({ message: "Echec" });
        console.log("oups");
      } else {
        res.json(data);
        console.log("parcours chargés", data);
      }
    });
  },
  addStep: (req, res) => {
    parcoursSchema.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $push: {
          etape: [
            {
              nomEtape: req.body.nomEtape,
              numeroEtape: req.body.numeroEtape,
              localisation: req.body.localisation,
              descriptionEtape: req.body.descriptionEtape,
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
  //
};

module.exports = parcours;