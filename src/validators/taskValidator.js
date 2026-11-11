
const { body } = require("express-validator");

// Validation mta3 creation tache
const createTaskValidator = [
    body("titre")
        .trim()
        .notEmpty().withMessage("Le titre est obligatoire")
        .isLength({ min: 3, max: 150 })
        .withMessage("Le titre doit contenir entre 3 et 150 caracteres"),

    body("description")
        .optional()
        .isString()
        .isLength({ max: 1000 })
        .withMessage("Description trop longue"),

    body("statut")
        .optional()
        .isIn(["todo", "doing", "done"])
        .withMessage("Statut invalide"),

    body("deadline")
        .optional({ values: "null" })
        .isISO8601()
        .withMessage("La deadline doit etre une date valide"),

    body("projet")
        .notEmpty().withMessage("Le projet est obligatoire")
        .isMongoId().withMessage("ID du projet invalide")
];

// Validation mta3 modification tache
const updateTaskValidator = [
    body("titre")
        .optional()
        .trim()
        .isLength({ min: 3, max: 150 })
        .withMessage("Titre invalide"),

    body("description")
        .optional()
        .isString()
        .isLength({ max: 1000 })
        .withMessage("Description trop longue"),

    body("statut")
        .optional()
        .isIn(["todo", "doing", "done"])
        .withMessage("Statut invalide"),

    body("deadline")
        .optional({ values: "null" })
        .isISO8601()
        .withMessage("Date invalide"),

    body("projet")
        .optional()
        .isMongoId()
        .withMessage("ID du projet invalide")
];

module.exports = {
    createTaskValidator,
    updateTaskValidator
};
