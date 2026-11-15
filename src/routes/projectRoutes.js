const express = require("express");
const projectController = require("../controllers/projectController");
const authenticate = require("../middlewares/authMiddleware");
const validateRequest = require("../middlewares/validateRequest");
const {
    createProjectValidator,
    updateProjectValidator,
    listProjectsValidator
} = require("../validators/projectValidator");

const router = express.Router();



// les routes lzemhom authentification, donc n7ottou middleware mta3 authentification
router.use(authenticate);
// route mte3 liste des projets
router.get("/", listProjectsValidator, validateRequest, (req, res) =>
    projectController.list(req, res)
);
// route mte3 création d'un projet
router.post("/", createProjectValidator, validateRequest, (req, res) =>
    projectController.create(req, res)
);
// route mte3 récupération d'un projet par son id
router.get("/:id", (req, res) => projectController.getById(req, res));
// route mte3 mise à jour d'un projet par son id
router.patch("/:id", updateProjectValidator, validateRequest, (req, res) =>
    projectController.update(req, res)
);
// route mte3 suppression d'un projet par son id
router.delete("/:id", (req, res) => projectController.delete(req, res));

module.exports = router;
