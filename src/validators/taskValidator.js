const { body, query } = require("express-validator");

const createTaskValidator = [
    body("titre").
    trim().
    notEmpty().
    withMessage("Le titre est obligatoire")
        .isLength({ min: 3, max: 150 }).withMessage("Le titre doit contenir entre 3 et 150 caractères"),
    body("description").optional().isString().withMessage("La description doit être un texte")
        .isLength({ max: 1000 }).withMessage("Description trop longue"),
    body("statut").optional().isIn(["todo", "doing", "done"]).withMessage("Statut invalide"),
    body("deadline").optional({ values: "null" }).isISO8601().withMessage("La deadline doit être une date valide")
];

const updateTaskValidator = [
    body("titre").optional().trim().isLength({ min: 3, max: 150 }).withMessage("Titre invalide"),
    body("description").optional().isString().isLength({ max: 1000 }).withMessage("Description invalide"),
    body("statut").optional().isIn(["todo", "doing", "done"]).withMessage("Statut invalide"),
    body("deadline").optional({ values: "null" }).isISO8601().withMessage("Date invalide")
];

const listTasksValidator = [
    query("search").optional().isString().isLength({ max: 100 }).withMessage("Recherche invalide"),
    query("statut").optional().isIn(["todo", "doing", "done"]).withMessage("Statut invalide"),
    query("sort").optional().isIn(["titre", "statut", "deadline", "createdAt"]).withMessage("Champ de tri invalide"),
    query("order").optional().isIn(["asc", "desc"]).withMessage("Ordre de tri invalide")
];

const assignTaskValidator = [
    body("utilisateurAssigne").notEmpty().withMessage("L'utilisateur est obligatoire")
        .isMongoId().withMessage("Identifiant utilisateur invalide")
];

module.exports = { createTaskValidator, updateTaskValidator, listTasksValidator, assignTaskValidator };
