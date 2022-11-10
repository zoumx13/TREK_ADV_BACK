const parcoursSchema = require("../models/ParcoursSchema");


const parcours = {
  createParcours: async (req, res) => {
    const {
      nomParcours,
      dureeParcours,
      description,
      prix,
      niveauDifficulte
    } = req.body;

    const newParcours = new parcoursSchema({
      nomParcours: nomParcours,
      dureeParcours: dureeParcours,
      description: description,
      prix: prix,
      niveauDifficulte: niveauDifficulte,

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
        console.log("parcours supprimé", data);
        res.status(200).json({ message: "data", data });
      }
    });
  },

  modifyParcours: (req, res) => {
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

    const updateData = {
      nomParcours: nomParcours,
      dureeParcours: dureeParcours,
      description: description,
      prix: prix,
      niveauDifficulte: niveauDifficulte,
      nomEtape: nomEtape,
      numeroEtape: numeroEtape,
      localisation: localisation,
      descriptionEtape: descriptionEtape,
    };

    parcoursSchema.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true },
      (err, docs) => {
        if (!err) {
          res.send(docs);
        } else {
          console.log(`Update error : ${err}`);
        }
      }
    );
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

  getParcoursById: (req, res) => {
    parcoursSchema.findById(req.params.id, (err, data) => {
      if (err) {
        res.status(404).json({ message: "error getParcoursById", err });
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
              localisation: [
                {
                lat : req.body.lat,
                long : req.body.long
                }
              ],
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

  deleteStep: (req, res) => {
    try {
      return parcoursSchema
        .findByIdAndUpdate(
          req.params.id,
          {
            $pull: {
              etape: {
                _id: req.body.stepId,
              },
            },
          },
          { new: true }
        )
        .then((docs) => res.send(docs))
        .catch((err) => res.status(400).send(err));
    } catch (err) {
      return res.status(400).send(err);
    }
  },
  modifyStep: (req, res) => {

  },
  addImg: (req, res) => {
    if (req.file) {
      const name = req.file.filename;
      const id = String(req.get("Authorization")).split(" ")[1];
      if (id) {
        const filter = { _id: id };

        const updateImage = {
          imgIllustration: name,
        };

        parcoursSchema.findOneAndUpdate(filter, updateImage, (err) => {
          if (err) {
            res.status(500).json(err);
          } else {
            res.json({ message: name });
          }
        });
      } else {
        res.json({ message: "Echec" });
      }
    } else {
      res.json({ message: "Echec" });
    }
  },
};

module.exports = parcours;
