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

// Kol les routes houni ma yetsam7ouch ken ba3d authentification.
router.use(authenticate);

router.get("/", listProjectsValidator, validateRequest, (req, res) =>
    projectController.list(req, res)
);
router.post("/", createProjectValidator, validateRequest, (req, res) =>
    projectController.create(req, res)
);
router.get("/:id", (req, res) => projectController.getById(req, res));
router.patch("/:id", updateProjectValidator, validateRequest, (req, res) =>
    projectController.update(req, res)
);
router.delete("/:id", (req, res) => projectController.delete(req, res));

module.exports = router;
