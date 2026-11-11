
const { body, query } = require("express-validator");

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

// Validation mta3 recherche w tri des projets.
const listProjectsValidator = [
    query("search")
        .optional()
        .isString().withMessage("La recherche doit etre un texte")
        .isLength({ max: 100 }).withMessage("Recherche trop longue"),

    query("statut")
        .optional()
        .isIn(["en_cours", "termine", "en_pause"])
        .withMessage("Statut du projet invalide"),

    query("sort")
        .optional()
        .isIn(["nom", "statut", "createdAt"])
        .withMessage("Champ de tri invalide"),

    query("order")
        .optional()
        .isIn(["asc", "desc"])
        .withMessage("Ordre de tri invalide")
];

module.exports = {
    createProjectValidator,
    updateProjectValidator,
    listProjectsValidator
};
