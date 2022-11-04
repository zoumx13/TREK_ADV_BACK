const Users_model = require("../models/users_model")

const maxAge = 3 * 24 * 60 * 60 * 1000;

const users = {
    CreerUser: async (req, res) => {
    },

    ModifierUser: async (req, res) => {v
    }, 

    EffacerUser: async (req, res) => {
    },

    ConnexionUser: async (req, res) => {
        let { identifiant, password } = req.body;
        // On trouve l'utilisateur dans la base de données à partir de son identifiant
        Users_model.findOne({ identifiant: identifiant }, async (err, user) => {
            if (err) {
                res.status(404).json({
                message: "Aucun utilisateur ne correspond à cet identifiant, veuillez vous enregistrer ou vérifier votre saisie.",
            });
            } else {
                const match = await bcrypt.compare(password, user.password);
                if (match == true) {
                    const token = jwt.sign({
                        userId: user._id,
                        },
                        process.env.DB_TOKEN_SECRET_KEY,
                        { expiresIn: maxAge }
                    );
                    res.cookie("jwt", token, {httpOnly:true, maxAge: maxAge });
                    res.json({ message: "Connecté", token: token });
                } else {
                    res.status(404).json({ message: "Mot de passe incorrect" });
                }
            }
        })
    },



};
module.exports = users;