const UserModel = require("../models/usersModel");
const bcrypt = require("bcrypt");
const users = {
  CreateUser: async (req, res) => {
    const password = req.body.passWord;
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        res.status(505).json(err);
      } else {
        const newUser = new UserModel({
          email: req.body.email,
          password: hash,
          role: req.body.role,
          nom: req.body.nom,
          prenom: req.body.prenom,
        });
        newUser.save((err) => {
          if (err) {
            res.status(500).json({ message: "Impossible de s'enregistrer" });
          } else {
            res.status(200).json({ message: "utilisateur enregistré " });
          }
        });
      }
    });
  },
  GetUser: async (req, res) => {
    const email = req.body.email;
    const passWord = req.body.passWord;

    users.findOne({ email: email }, (err, data) => {
      if (!data) {
        res.status(404).json({ message: "Echec" });
      } else {
        bcrypt.compare(passWord, data.passWord, (error, hash) => {
          if (error) {
            res.status(404).json({ message: "Echec" });
          } else {
            if (!hash) {
              res.status(404).json({ message: "Echec" });
            } else {
              const token = jwt.sign(
                {
                  userId: data._id,
                },
                "secret",
                { expiresIn: "24h" }
              );
              res.json(token);
            }
          }
        });
      }
    });
  },

  EditUser: async (req, res) => {},

  DeleteUser: async (req, res) => {},
};
module.exports = users;
