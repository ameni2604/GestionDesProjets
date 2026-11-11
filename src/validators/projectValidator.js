
const { body } = require("express-validator");

// Validation mta3 creation projet
const createProjectValidator = [
    body("nom")
        .trim()
        .notEmpty().withMessage("Le nom du projet est obligatoire")
        .isLength({ min: 3, max: 100 })
        .withMessage("Le nom doit contenir entre 3 et 100 caracteres"),

    body("description")
        .optional()
        .isString().withMessage("La description doit etre un texte")
        .isLength({ max: 1000 })
        .withMessage("Description trop longue"),

    body("statut")
        .optional()
        .isIn(["en_cours", "termine", "en_pause"])
        .withMessage("Statut du projet invalide")
];

// Validation mta3 modification projet
const updateProjectValidator = [
    body("nom")
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage("Nom invalide"),

    body("description")
        .optional()
        .isString()
        .isLength({ max: 1000 })
        .withMessage("Description trop longue"),

    body("statut")
        .optional()
        .isIn(["en_cours", "termine", "en_pause"])
        .withMessage("Statut du projet invalide")
];

module.exports = {
    createProjectValidator,
    updateProjectValidator
};
