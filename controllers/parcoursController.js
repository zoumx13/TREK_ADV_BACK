const parcoursSchema = require("../models/ParcoursSchema");
const mongoose = require("mongoose")


const parcours = {
  createParcours: async (req, res) => {
    const { nomParcours, dureeParcours, description, prix, niveauDifficulte } =
      req.body;

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

  addImgParcours: (req, res) => {
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

  modifyParcours: (req,res) => {
    const nomParcours = req.body.nomParcours;
    const dureeParcours = req.body.dureeParcours;
    const prix = req.body.prix;
    const description = req.body.description;
    const niveauDifficulte = req.body.niveauDifficulte;
    try {
      parcoursSchema
        .findOneAndUpdate(
          { _id: req.params.id },
          {
            $set: {
              "nomParcours": nomParcours,
              "dureeParcours": dureeParcours,
              "prix": prix,
              "description": description,
              "niveauDifficulte": niveauDifficulte,
            },
          },
          { new: true }
        )
        .then((docs) => res.json({ message: "parcours modifiée", docs }))
        .catch((err) => res.status(400).send(err));
    } catch (err) {
      return res.status(400).send(err);
    }
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

  addStep: async (req, res) => {
    try {
      const idStep = new mongoose.Types.ObjectId();
      const filter = { _id: req.params.id }
      const update = {
        etape: [
          {
            nomEtape: req.body.nomEtape,
            numeroEtape: req.body.numeroEtape,
            localisation: [
              {
                lat: req.body.lat,
                long: req.body.long,
              },
            ],
            descriptionEtape: req.body.descriptionEtape,
            _id: idStep,
          },
        ],
      }
      parcoursSchema
        .findByIdAndUpdate( filter, 
          {
            $push: update
          },  
          {
            new: true,
          },
        )
        .then((newObject) => res.json({ message: "étape publiée", idStep }))
        .catch((err) => res.status(400).send(err));
    } catch (err) {
      return res.status(400).send(err);
    }
  },

  addImgStep: (req, res) => {
    if (req.file) {
      const name = req.file.filename;
      const idParcours = req.params.id;
      const idStep = req.params.idStep;
      try {
        parcoursSchema
          .findOneAndUpdate(
            { _id: idParcours, "etape._id": idStep },
            {
              $set: {
                "etape.$.imgIllustrationEtape": name,
              },
            },
            { new: true }
          )
          .then((docs) => res.json({ message: "image publiée", docs }))
          .catch((err) => res.status(400).send(err));
      } catch (err) {
        return res.status(400).send(err);
      }
    }
  },

  deleteStep: (req, res) => {
    try {
      parcoursSchema
        .findByIdAndUpdate(
          { _id: req.params.id },
          {
            $pull: {
              etape: {
                _id: req.params.idStep,
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
    const nomEtape = req.body.nomEtape;
    const numeroEtape = req.body.numeroEtape;
    const lat = req.body.lat;
    const long = req.body.long;
    const descriptionEtape = req.body.descriptionEtape;
    try {
      parcoursSchema
        .findOneAndUpdate(
          { _id: req.params.id, "etape._id": req.params.idStep },
          {
            $set: {
              "etape.$.nomEtape": nomEtape,
              "etape.$.numeroEtape": numeroEtape,
              "etape.$.localisation[0].lat": lat,
              "etape.$.localisation[0].long": long,
              "etape.$.descriptionEtape": descriptionEtape,
            },
          },
          { new: true }
        )
        .then((docs) => res.json({ message: "étape modifiée", docs }))
        .catch((err) => res.status(400).send(err));
    } catch (err) {
      return res.status(400).send(err);
    }
  },

};

module.exports = parcours;
