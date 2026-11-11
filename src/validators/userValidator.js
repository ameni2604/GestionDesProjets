const { body } = require("express-validator");

// Validation mta3 inscription
const registerValidator = [
    body("nom")
        .trim()
        .notEmpty().withMessage("Le nom est obligatoire")
        .isLength({ min: 2, max: 50 })
        .withMessage("Le nom doit contenir entre 2 et 50 caracteres"),

    body("login")
        .trim()
        .notEmpty().withMessage("Le login est obligatoire")
        .isLength({ min: 3, max: 30 })
        .withMessage("Le login doit contenir entre 3 et 30 caracteres"),

    body("password")
        .notEmpty().withMessage("Le mot de passe est obligatoire")
        .isLength({ min: 6 })
        .withMessage("Le mot de passe doit contenir au moins 6 caracteres"),

    body("role")
        .notEmpty().withMessage("Le role est obligatoire")
        .isIn(["user", "manager"])
        .withMessage("Le role doit etre user ou manager")
];

// Validation mta3 connexion
const loginValidator = [
    body("login")
        .trim()
        .notEmpty().withMessage("Le login est obligatoire"),

    body("password")
        .notEmpty().withMessage("Le mot de passe est obligatoire")
];

module.exports = {
    registerValidator,
    loginValidator
};
