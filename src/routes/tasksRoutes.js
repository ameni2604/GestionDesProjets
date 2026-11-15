const express = require("express");
const taskController = require("../controllers/taskController");
const authenticate = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");
const validateRequest = require("../middlewares/validateRequest");
const {
    createTaskValidator, updateTaskValidator, listTasksValidator, assignTaskValidator
} = require("../validators/taskValidator");

const router = express.Router();
// lzem authentification bch acceder aux routes mte3 les tâches

router.use(authenticate);

// Route pour lister les tâches d'un projet
router.get("/projects/:projectId/tasks", listTasksValidator, validateRequest, (req, res) =>
     taskController.list(req, res));
// Route pour créer une tâche dans un projet
router.post("/projects/:projectId/tasks", createTaskValidator, validateRequest, (req, res) =>
     taskController.create(req, res));
// Route pour récupérer une tâche par son ID
router.get("/tasks/:id", (req, res) =>
     taskController.getById(req, res));
// Route pour mettre à jour une tâche par son ID
router.patch("/tasks/:id", updateTaskValidator, validateRequest, (req, res) => 
    taskController.update(req, res));
// Route pour supprimer une tâche par son ID
router.delete("/tasks/:id", (req, res) =>
     taskController.delete(req, res));

// Route pour assigner une tâche à un utilisateur
router.patch("/tasks/:id/assign", authorize("manager"), assignTaskValidator, validateRequest, (req, res) =>
     taskController.assign(req, res));

module.exports = router;
